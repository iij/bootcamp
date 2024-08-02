FROM amazoncorretto:17.0.8
WORKDIR /app

# 開発ツールインストール
RUN yum update \
    && yum install vim emacs -y \
    && yum clean all

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
