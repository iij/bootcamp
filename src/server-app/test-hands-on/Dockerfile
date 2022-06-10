FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /test-hands-on
WORKDIR /test-hands-on
COPY . /test-hands-on
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
