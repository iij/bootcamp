# DI について

ここでは DI・DI コンテナ の概念について解説をします。

## DI の実際の例

簡単な例として下記のようなクラスを考えてみましょう。(PoC なので動きません)

```java
import HttClientConfig;
import HttpClient;
import HttpClientBuilder;
import SlackClientErrorHandler;
import CommonErrorHandler;

/**
 * SlackAPIをコールするHTTP通信を行います
 */
public class SlackClient {

    /**
     * HTTP Client
     */
    private final HttpClient client;

    public SlackClient() {

        // SlackのAPIをコールするためのHttpClientを構築する
        String proxy = System.getenv("proxy");
        HttpClientConfig httpClientConfig = new HttClientConfig();
        httpClientConfig.setProxy(proxy);
        HttpClient client = HttpClientBuilder.setConfig(config).build();
        client.addErrorHandler(new SlackClientErrorHandler());
        client.addErrorHandler(new CommonErrorHandler());
        this.client = client;
    }
    // do something
}

/**
 * SlackClientを使う側
 */
public class Main() {
    public static main(String[] args) {
        SlackClient client = new SlackClient();
        client.execute(...);
    }
}
```

さて、この SlackClient クラスの問題点はなんでしょうか？ざっと見る限り下記の問題があります。

1. SlackClient が責務を持ちすぎている

   - SlackClient クラスが欲しいものは「適切な HttpClient クラスのインスタンス」であり、HttpClient の作り方ではありません。しかし今の実装では SlackClient に HttpClient の作り方が依存してしまっている。

2. 再利用性が低い

   - SlackClient クラスを利用する側で設定を変更できず、「A の場合にはこの設定を、B の場合には別の設定をしたい」とする場合、変更が非常に大きくなる

これらの問題を解決するために、DI パターンと DI コンテナを使うことですっきりすることができます。

```java

/**
 * SlackAPIをコールするHTTP通信を行います
 */
public class SlackClient {
    /**
     * HTTP Client
     */
    private final HttpClient client;

    // SlackClientはHttpClientの作り方を知る必要はない、外部からもらってくるようにする
    public SlackClient(HttpClient client) {
        this.client = client;
    }
    // do something...
}

/**
 * DIに利用してもらうインスタンスを管理します(=DIコンテナ)
 */
public class DIContainer {

    // DIコンテナ本体。DIコンテナにインスタンスを登録していろんなところで使い回す
    private Container container;

    public DIContainer() {
        HttpClientConfiguration configuration = new HttpClientConfiguration();

        // slackHttpClient という名前でHttpClientを作成してDIコンテナに登録する
        this.container.register("slackHttpClient", () -> {
            HttpClientConfig config = new HttClientConfig();
            config.setSomething("something");
            HttpClient client = HttpClientBuilder.setConfig(config).build();
            client.addErrorHandler(new SlackClientErrorHandler());
            client.addErrorHandler(new CommonErrorHandler());
            return client;
        });

        // slackHttpClient2 という名前でHttpClientを作成してDIコンテナに登録する
        this.container.register("slackHttpClient2", () -> {
            HttpClient client = HttpClientBuilder.build();
            client.addErrorHandler(new CommonErrorHandler());
            return client;
        });
    }

    // DIコンテナに登録されているコンポーネントを取り出す
    public Object getComponent(String name) {
        return this.container(name);
    }
}

public class Main() {
    public static void main(String[] args) {
        DIContainer container = new DIContainer();

        // 用途の異なるSlackClientをHttpClientだけ差し替えることで共通化できる
        SlackClient client = new SlackClient(container.getComponent("slackHttpClient"));
        SlackClient client2 = new SlackClient(container.getComponent("slackHttpClient2"));
        // do something
    }
}
```

クラスがグッと増えましたが、SlackClient から依存していた責務を分散することができ、かつ再利用性の高いコードを作成することができるようになりました。

このように、クラスとクラスの間の依存を減らすことができるのが DI・DI コンテナの非常に強いメリットです。

## Springboot の場合

Springboot にはデフォルトで DI コンテナの機能が整っています。SpringBoot の DI コンテナを利用する場合はコンテナに管理を任せたいクラスにアノテーションをつけて指定します。

先ほどの SlackAPI の例を Springboot の DI コンテナとして使う場合下記の通りになります。

```java

/*
 * Componentアノテーションがついたクラスのコンストラクターに、Springbootのコンテナが勝手に代入される(=オブジェクトが注入される)
 */
@Component
public class SlackClient {

    private final HttpClient client;

    // clientにはSpringbootが自動で生成したオブジェクトが入る
    // 通称：コンストラクタインジェクション
    public SlackClient(HttpClient client) {
        this.client = client;
    }
    // do something...
}

＠Configuration
public class HttpClientConfiguration {

    // slackHttpClient という名前でHttpClientを作成してDIコンテナに登録する
    @Primary
    @Bean
    public HttpClient slackHttpClient() {
        HttpClientConfig config = new HttClientConfig();
        config.setSomething("something");
        HttpClient client = HttpClientBuilder.setConfig(config).build();
        client.addErrorHandler(new SlackClientErrorHandler());
        client.addErrorHandler(new CommonErrorHandler());
        return client;
    }

    // slackHttpClient2 という名前でHttpClientを作成してDIコンテナに登録する
    @Bean
    public HttpClient slackHttpClient2() {
        HttpClient client = HttpClientBuilder.build();
        client.addErrorHandler(new CommonErrorHandler());
        return client;
    }
}

@SpringBootApplication
public class Main() {

    // Autowiredアノテーションが付与されたフィールドには
    // Spriongbootの管理するDIコンテナから該当するオブジェクトが注入される
    // 通称：フィールドインジェクション
    @Autowired
    private SlackClient slackClient;

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);

        this.slackClient.execute(...);
    }
}
```
