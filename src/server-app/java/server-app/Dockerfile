FROM openjdk:11.0.9.1
WORKDIR /app

# 開発ツールインストール
RUN apt update \
    && apt install vim emacs -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 固定シェルとプロジェクト設定をコピー
COPY gradlew settings.gradle /app/

# gradleバイナリ本体
COPY gradle /app/gradle/

# 依存関係をビルド
COPY build.gradle /app/
RUN ./gradlew dependencies

# ソースコードコピー＆ビルド
COPY src /app/src/
RUN ./gradlew build

CMD ["bash"]
