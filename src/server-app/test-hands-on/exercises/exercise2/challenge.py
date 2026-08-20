from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def get_index():
    return {"message": "hello world"}


@app.get("/echo/{data}")
def get_echo(data: str):
    return {"message": "got the message: {0}".format(data)}
