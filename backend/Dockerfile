FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements-dev.txt ./

FROM base AS dev

RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . .

EXPOSE 8000

FROM base AS prod

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.prod.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.prod.sh"]
