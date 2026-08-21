FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim
ENV PYTHONUNBUFFERED=1
ENV UV_LINK_MODE=copy
WORKDIR /test-hands-on

COPY pyproject.toml uv.lock /test-hands-on/
RUN uv sync --frozen

COPY exercises /test-hands-on/exercises

EXPOSE 8000

ENTRYPOINT []
CMD ["sleep", "infinity"]
