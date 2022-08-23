FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /test-hands-on
WORKDIR /test-hands-on
COPY ./requirements.txt /test-hands-on

RUN pip install --upgrade pip --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org
RUN pip install -r requirements.txt --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org

EXPOSE 8000
