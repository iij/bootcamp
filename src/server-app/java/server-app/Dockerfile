FROM amazoncorretto:21
WORKDIR /app

# プロジェクトファイルをコピー
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
