from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, Film2 Backend!"}

@app.post("/upload-video/")
async def upload_video(file: UploadFile = File(...)):
    contents = await file.read()
    # Просто возвращаем размер файла для проверки
    return JSONResponse(content={"filename": file.filename, "size": len(contents)})
