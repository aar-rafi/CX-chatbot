# Project Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Backend](#backend)
3. [Frontend](#frontend)
4. [Setup](#setup)
5. [License](#license)

## Introduction

Simple QA Chatbot interface powered by **deepset/roberta-base-squad2** and **haystack** pipeline

#### demo
![Vite + React - Google Chrome 9_20_2024 11_49_25 AM](https://github.com/user-attachments/assets/42d4ee1a-7344-4a91-9422-923c6a2e1051)

## TODO List

- [x] Upload document and Process
- [x] Play Audio button beside respective answer
- [ ] Make the store scalable (Elastic Search Document Store)
- [ ] Fine Tune the Reader
- [ ] Implement user authentication
- [ ] Add a Databse to store chats
- [ ] Enhance UI/UX design

## Backend

### Technologies Used

- Python
- FastAPI
- Haystack

## Frontend

### Technologies Used

- React.js
- Axios
- TailwindCSS

## Setup

To set up the project locally, follow these steps:

### Backend

1. Navigate to the backend folder:

```sh
cd backend
```

2. Create a virtual environment:

```sh
python -m venv venv
```

3. Activate the virtual environment:

- On Windows:
  ```sh
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```sh
  source venv/bin/activate
  ```

4. Install dependencies:

```sh
pip install -r requirements.txt
```

5. Start the server:

```sh
uvicorn main:app --reload
```

### Frontend

1. Navigate to the frontend folder:

```sh
cd frontend
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
