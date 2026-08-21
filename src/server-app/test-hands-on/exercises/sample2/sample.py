from fastapi import FastAPI

app = FastAPI()


@app.get("/hello")
async def get_hello():
    return {"response": "hello"}
