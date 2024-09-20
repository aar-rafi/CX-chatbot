import base64
import os
import logging
from pathlib import Path
import uuid
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from haystack.document_stores import InMemoryDocumentStore
from haystack.nodes import BM25Retriever, FARMReader, PDFToTextConverter
from haystack.pipelines import ExtractiveQAPipeline
from haystack.pipelines.standard_pipelines import TextIndexingPipeline
from gtts import gTTS
import shutil

# Set up logging
logging.basicConfig(format="%(levelname)s - %(name)s -  %(message)s", level=logging.WARNING)
logging.getLogger("haystack").setLevel(logging.INFO)

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = 'uploaded_docs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
TEMP_FOLDER = 'temp'
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Static files directory for audio responses (if needed)
app_dir = os.path.dirname(os.path.abspath(__file__))
audio_files_dir = os.path.join(app_dir, "audio_files")
app.mount("/audio", StaticFiles(directory=audio_files_dir), name="audio")

# Set up Haystack components
document_store = InMemoryDocumentStore(use_bm25=True)
retriever = BM25Retriever(document_store=document_store)
reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=True)
pipe = ExtractiveQAPipeline(reader, retriever)

converter = PDFToTextConverter(
    remove_numeric_tables=True,
    valid_languages=["de","en"]
)

# Function to index documents
def index_documents(doc_dir):
    files_to_index = [os.path.join(doc_dir, f) for f in os.listdir(doc_dir)]
    indexing_pipeline = TextIndexingPipeline(document_store)
    indexing_pipeline.run_batch(file_paths=files_to_index)

# Index the documents at startup
print("Indexing documents...Wait for a few seconds.")
index_documents("data/build_your_first_question_answering_system")

# Request model for question-answering
class QuestionRequest(BaseModel):
    question: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Company X Chatbot API"}

# Route to handle health check
@app.get("/health")
async def health_check():
    index_documents(UPLOAD_FOLDER)
    return {"status": "healthy"}


# Route to handle question-answering
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    question = request.question
    if not question:
        raise HTTPException(status_code=400, detail="No question provided")

    # Get the answer from the Haystack pipeline
    prediction = pipe.run(
        query=question,
        params={"Retriever": {"top_k": 10}, "Reader": {"top_k": 5}}
    )

    answers = prediction['answers']
    # bans = max(answers, key=lambda x: x['answer'])
    if answers:
        best_answer = answers[0].answer
        # best_answer = bans['answer']
    else:
        best_answer = "No answer found."

    # Convert answer to audio using gTTS
    tts = gTTS(text=best_answer, lang='en')
    uid = uuid.uuid4()
    uid_bytes = uid.bytes
    short_uid = base64.urlsafe_b64encode(uid_bytes).rstrip(b'=').decode('ascii')
    filename = f"{short_uid}_answer.mp3"

    audio_file_path = os.path.join(audio_files_dir, filename)
    os.makedirs(audio_files_dir, exist_ok=True)
    tts.save(audio_file_path)

    audio_url = f"audio/{filename}"
    return JSONResponse(content={"question": question, "answer": best_answer, "audio_url": audio_url})

# Route to upload documents
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(TEMP_FOLDER, file.filename)
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    docs=converter.convert(file_path=Path(file_location), meta=None)
    output_file_path = Path(UPLOAD_FOLDER) / f"{file.filename}.txt"
    with open(output_file_path, 'w', encoding='utf-8') as f:
        for doc in docs:
            f.write(doc.content)

    index_documents(UPLOAD_FOLDER)

    return JSONResponse(content={"message": f"File '{file.filename}' uploaded and indexed successfully."})


# Index the documents at startup
# index_documents("data/build_your_first_question_answering_system")
# index_documents(UPLOAD_FOLDER)