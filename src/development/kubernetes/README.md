---
footer: CC BY-SA Licensed | Copyright (c) 2020, Internet Initiative Japan Inc.
title: Kubernetes入門
description: Kubenetesの基本的なアーキテクチャを学び、実際に触ってみる
time: 2h
prior_knowledge: deployment
---
<header-table/>

# Kubernetes でアプリ開発

## 0. まえがき
### 0-1. 想定している受講者
本講義では以下の受講者を対象としています。
- Kubernetesという名前は知っているがどんなものなのかは知らない
- Kubernetes入門しようにも何から始めたらいいのかわからない
- Kubernetesの仕組みがわからない

### 0-2. 前提知識
以下の点を知らないと講義についていけない可能性があります。
- Linuxの基本的なコマンド
- dockerの基礎

加えて以下の点を知っていると講義をスムーズに聞けます。
- YAMLファイルの読み方/書き方
- コンテナアーキテクチャの基礎

### 0-3. 事前準備
- docker のインストール
- Kubernetes環境
  - katacodaを使ってください
    - https://www.katacoda.com/courses/kubernetes/playground
    - __**外部リソースなのでコピペする際は気を付けてください**__
  - どうしてもローカルでkubernetesを動かしたい人はk0sを以下の手順で構築してください

> k0s環境の構築
> 
> k0s in dockerはprivileged(特権モード)を必須としています。セキュリティの観点から使わないときは必ずコンテナを落としてください。
> ```
> # docker run -d --name k0s --hostname k0s --privileged -v /var/lib/k0s -p 6443:6443 docker.io/k0sproject/k0s:latest
> # docker exec k0s kubectl get nodes
> NAME   STATUS   ROLES    AGE   VERSION
> k0s    Ready    <none>   36m   v1.21.3+k0s
> ```
> kubectlを使うときは適宜docker内に入って実行した方が楽です。講義内で使うファイルも中に格納すると楽です。
> ```
> # docker exec -it k0s /bin/bash
> docker~# kubectl get nodes
> ```

## 1. Kubernetesとは

Kubernetesは複数サーバで構成された基盤上でコンテナ群を一元管理するためツール「コンテナオーケストレーションツール」と呼ばれるものです。最近ではdockerを使ってコンテナ単位でアプリケーションを実装することが多くなりましたが、docker単体では複数台のdockerホスト上でコンテナ群を一元管理することができません。そのため複数ホストで構成される規模のプロダクションに耐えられるシステムをdocker単体で構築することは困難とされてきました。そこで複数のdockerホストに跨ってコンテナアプリケーションをデプロイ、スケーリング、ネットワーク管理機能などをするオーケストレーションツールが登場しました。

Kubernetesは元々Googleがアプリケーションデプロイに利用していたBorgと呼ばれるクラスターマネージャーをOSS化したもので、現在はLinux Foundation傘下にあるCNCF(Cloud Native Computing Foundation)が管理しています。ランクはGraduatedで成熟したCNCFプロジェクトとなっています。

> 【豆知識】
> 
> Kubernetesはギリシャ語で「操舵士」や「パイロット」を意味し、ロゴは操舵士にちなんで舵をモチーフにされています。7つのスポークは当初のKubernetesのコードネーム「Project Seven」にちなんでいます。

KubernetesをベースにカスタマイズしたKubernetesサービスを最近ではKaaS(Kubernetes as a Service)といい、AWSやGCPなどの各クラウドベンダで提供されています。

- Amazon EKS
- Google Kubernetes Engine(GKE)
- Azure Kubernetes Service(AKS)

先ほど「カスタマイズ」と言いましたが、Kubernetesはそれ単体で完成するものではなくログ基盤にfluentdとelasticsearchを使ったり、それぞれのクラウドサービスとの繋ぎこみなど提供元によって機能やスペックが異なります。このようにカスタマイズされたKubernetes基盤のことをLinuxのディストリビューションに例えて「Kubernetesディストリビューション」と呼びます。

IIJでも社内向けのKubernetes基盤としてIKE(IIJ Kubernetes Engine)の運用と導入が進んでいます。

- [IIR](https://www.iij.ad.jp/dev/report/iir/040/03.html)
- [IIJエンジニアブログ](https://eng-blog.iij.ad.jp/kubernetes)

従来のVMでのシステム構築と比べてKubernetesを利用することでシステム開発・管理が格段に楽になります。例えば従来のシステム構築では、どのVMに何を割り当てるかのリソース計算を人が考えなければならず、システムがスケーリングするたびに多くの労力を使いましたが、Kubernetesではマシンリソースやネットワークをプールとして扱い自動で管理するため、システムのスケーリングに柔軟に対応することができます([詳細](https://kubernetes.io/ja/docs/tutorials/kubernetes-basics/scale/scale-intro/))。また、従来ではシステムのアップデートを行うたびに「サービス停止→アップデート→サービス再開」という手順でアップデートをしていたが、Kubernetesではサービスを停止することなくシステムアップデートを行うことができ、サービス可用性を高めてくれます([詳細](https://kubernetes.io/ja/docs/tutorials/kubernetes-basics/update/update-intro/))。

上記以外にも多くのメリットがあり、Kubernetesでシステム開発を行うとアプリの構築作業が劇的に減る他、APIなどからの自動デプロイなども非常に簡単に行うことができます。

## 2. Kubernetesの基本構造
### 2-1. 宣言的な構成管理
Kubernetes上にアプリケーションをデプロイする際、その構成管理は宣言的に行われます。デプロイしたい人は「アプリケーションやそれを構成するコンテナ群はこのような配置であるべき」という宣言(manifest)を**マニフェストファイル**に記載することで、Kubernetesはマニフェストファイルに沿った構成を宣言どおりにデプロイします。このような構成管理方法はIaC(Infrastructure as a Code)と呼ばれており、Ansible同様に冪等性の確保や自動化に貢献しています。このような構成管理方法の主なメリットはGitによるバージョン管理のしやすさが挙げられます。
> Ansibleで「Playbook」と呼ばれているものがKubernetesでいう「Manifest」です。

### 2-2. コントロールプレーンとワーカーノード
Kubernetesは大きく分けて2つの要素で構成されています。**コントロールプレーン**と**ワーカーノード**です。
> 文献によってはコントロールプレーンのことを**マスターノード**と表記することがありますが、同じ意味なので誤解の無いように注意してください。

![component](./images/components-of-kubernetes.svg)

#### 2-2-1. コントロールプレーン
コントロールプレーンはKubernetesクラスター全体の状態の管理を行うことが主な仕事です。例えばアプリ開発者が宣言したマニフェストファイルどおりに作られたPodがワーカーノードに割り当てられているかを監視し、割り当てられていなかった場合はそのPodを実行するノードを各のノードのリソース状況を考慮して割り当てます。このようなコンポーネントを**kube-schduler**と言います。他にもマニフェストファイルによって宣言された構成情報を閲覧/編集するためのAPIサーバの役割を果たす**kube-apiserver**などがあります。(他のコンポーネントも知りたい人は[公式ページ](https://kubernetes.io/ja/docs/concepts/overview/components/)へ)
> 【Podとは】
> 
> Kubernetesはコンテナを「pod」と呼ばれる単位で管理します。podにはいくつかのコンテナの集まりで、同じpodに所属するコンテナ同士はlocalhostでお互いに通信することができます。
> ![Pod](./images/module_03_pods.svg)
> Podにどのようなコンテナを同居させるのかは設計次第ですが、例えばアプリのログを集めるコンテナを同じpodに同居させたり、nginxなどwebのフロントになるアプリを同居させたりします。

#### 2-2-2. ワーカーノード
ワーカーノードはPodの管理やPodの実行環境/通信機能を提供することが主な仕事です。例えばコントロールプレーンコンポーネントである**kube-apiserver**から受け取った構成情報どおりにPodが稼働するように管理します。このようなコンポーネントを**kubelet**と言います。ただしkubeletは実際にPodを作成したり、そのネットワーク環境を構築することはせず、あくまでもノード上のPod状態を維持するように管理することが仕事です。実際にPodを作ったりするコンポーネントを**コンテナランタイム**と言います。他には、後程出てきますがService宛の通信を稼働中のPod群へ転送させる**kube-proxy**などがあります。

### 2-3. Kubernetesの基本構造まとめ
Kubernetesは主に**コントロールプレーン**と**ワーカーノード**に分けられており、コントロールプレーンはクラスター全体の状態管理、ワーカーノードはコントロールプレーンからの指示通りにユーザによって宣言された構成を作り上げることが役割でした。そして、それぞれの役割を果たすために多くのコンポーネントが内蔵されている、という話でした。各コンポーネントについてもっと詳しく知りたい方は[公式ページ](https://kubernetes.io/ja/docs/concepts/architecture/)を参照してください。

## 3. マニフェストファイルの書き方
### 3-1. Kubernetesオブジェクト
先ほども説明したように、Kubernetes上にPodなどをデプロイする際、ユーザはマニフェストファイルを書く必要があります。マニフェストファイルではいくつかのKubernetesオブジェクトを組み合わせて、ユーザの意図する状態を記載します。マニフェストファイルに記載されたKubernetesオブジェクトはコントロールプレーンによって読み取られ、読み取られたKubernetesオブジェクトが存在し続けるようにクラスター全体を管理します。

> 【Kubernetesオブジェクト】
> 
> Kubernetesオブジェクトはクラスターの状態を表現するパーツです。以下にKubernetesオブジェクトの例と簡単な説明を記載します
> - ReplicaSet: Pod群の稼働状況を管理する
> - Deployment：バージョンに相当するReplicaSetを管理する
> - CronJob：定期実行するpodを管理する
> - Service：特定のラベルを持ち、サービスを提供できる状態のPod群への接続を提供する
> - Ingress：証明書やドメイン名を通して外部からの通信を制御する
> - PersistentVolume：ストレージなどの永続化volumeを管理する
> 
> 代表的な物を上げましたが、他にも色々あります。興味のある方は[公式サイト](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/)参照。

### 3-2. Deployment

上でも述べた通りDeploymentはPodの稼働状況を管理するオブジェクトです。予め起動するPodの数を指定することで、何かしらの原因でPodが消失しても自動で立ち上げ直してくれたり、逆に多すぎる場合は終了させます。

現在稼働しているPodは、kubectlというcliツールを使って確認できます。
今は何も稼働してないはずです。

> 【kubectl】
> 
> KubernetesのコントロールプレーンにはKubernetesクラスターの構成管理情報にアクセスするためのエンドポイントを提供する**kube-apiserver**がありますが、生身の人間がAPIを生で叩いて**kube-apiserver**にアクセスするのは少しキツイものがあります。そこでAPIをコマンドで操作できる**kubectl**というものがあり、kubectlを使うことによりコマンドベースでAPIを叩くことができます。

```
$ kubectl get pods
No resources found in default namespace.
```

以下のようなマニフェストファイルを`app.yml`として作成し、Kubernetesクラスターにデプロイしてみましょう。
`image`として指定しているのはサンプル用の簡単なアプリです。

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bootcamp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: bootcamp
  template:
    metadata:
      labels:
        app: bootcamp
    spec:
      containers:
      - name: bootcamp-app
        image: gcr.io/google-samples/node-hello:1.0
        ports:
          - containerPort: 8080
      restartPolicy: Always
```
> 【Deploymentにおける必須フィールド】
> 
> Kubernetesオブジェクトをマニフェストファイルに記載する際、必ず以下のフィールドに値をセットする必要があります
> - apiVersion：オブジェクトのAPIVersionを指定
> - kind：どのオブジェクトを作るかを指定
> - metadata：オブジェクトを特定するための情報を指定
> - spec：オブジェクトの状態を指定


`apiVersion`にはオブジェクトのAPIVersionを書きます。
オブジェクトAPIがどのAPIGROUPに属しているかでapiVersionの書き方が変わってきます。
今回はDeploymentのオブジェクトなのでそのAPIグループを調べます。

```
$ kubectl api-resources
NAME                              SHORTNAMES         APIGROUP                           NAMESPACED   KIND
bindings                                                                                true         Binding
componentstatuses                 cs                                                    false        ComponentStatus
configmaps                        cm                                                    true         ConfigMap
...
deployments                       deploy             apps                               true         Deployment
```

ここではDeploymentが`apps`に属しているということが分かりました。
もしAPIGROUPが空の場合はCore groupに属するため、`apiVersion: v1`で問題ないです。
次にAPIGROUPで利用可能なversionを調べます。

```
$ kubectl api-versions | grep apps
apps/v1
apps/v1beta1
apps/v1beta2
```

ここでは3つほど出ましたが、この中の最も新しいversionを使ってください。
今回は`apps/v1`を使ってマニフェストファイルを作りました。


yamlを作成したら、以下のコマンドでデプロイできます。

```bash
$ kubectl apply -f app.yml
deployment.apps/bootcamp created
```

別端末で`get pods`しながらpodが作られる様子を見てみましょう`-w`をつけると自動で表示を更新してくれます。

```bash
$ kubectl get pods -w
NAME                        READY   STATUS              RESTARTS   AGE
bootcamp-6bcddb7cf8-jpzg5   0/1     ContainerCreating   0          11s
bootcamp-6bcddb7cf8-tq2fs   0/1     ContainerCreating   0          11s
bootcamp-6bcddb7cf8-jpzg5   1/1     Running             0          83s
bootcamp-6bcddb7cf8-tq2fs   1/1     Running             0          84s
```

`Running`となっていれば無事にアプリケーションが起動しました。今回は`replicas`に`2`を指定したのでpodが2個起動しています。`replicas`の値を変えて再度`kubectl apply`して遊んでみましょう。

### 3-3. Service

Podの起動ができましたので、次はPodへのアクセスを試みます。KubernetesクラスターではPod群へのサービスディスカバリーの方法としてServiceオブジェクトが用いられます。Serviceを利用することでPod群に共通のIPアドレスを割り当て、まるで一つの「サービス」であるかのようにアクセスできるようになります。

> 【PodとServiceの関係】
> 
> Podは生成の度にIPアドレスが割り振られます。これは何かしらの理由でPodが落ちて別のPodが再生成されるときにもIPアドレスが割り振られますが、落ちたPodと同じIPアドレスが割り振られるとは限りません。こうなった場合に新しいPodへアクセスしたい別Podは新しいPodのIPアドレスがわからなくなってしまいます。ServiceはこのようなPodを共通のIPアドレスで管理し、Podへのアクセスやロードバランシングを行う役割を持っています。また、Serviceの生成によりKubernetesクラスター内の[CoreDNS](https://kubernetes.io/ja/docs/tasks/administer-cluster/coredns/)のA/AAAAレコードやPod内の`resolve.conf`が自動的に書き換えられるため、Service名を使ってPodへアクセスすることも可能になります。

> 【ServiceからPodへの通信の受け渡し】
> 
> Serviceが作られるとService宛の通信がPodへ転送されますが、その仕組みは**ワーカーノード**内のコンポーネントである**kube-proxy**によって実現されます。すべてのServiceは基本的にClusterIP(あとで説明します)によるVIPの保持が義務付けられており、またClusterIP配下のPodのIPアドレスはendpointに記載されています。そして、ClusterIPからPodの持つIPへの振り替えを**kube-proxy**が行います。**kube-proxy**の振り替え方式はいくつか選択肢がありますが、デフォルトの**iptableモード**ではiptablesのchainがあり、これによってパケットが転送されます。他のモードについて知りたい方は[公式ページ](https://kubernetes.io/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)を参照してください。

先ほどと同じようにServiceのマニフェストファイルを作りましょう。今回は`service.yml`とします。

```yml
apiVersion: v1
kind: Service
metadata:
  name: bootcamp-svc
spec:
  type: ClusterIP
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: bootcamp
```
Serviceオブジェクトの中には様々なサービスタイプ種類があり、今回は`ClusterIP`というサービスタイプを利用しています。ClusterIPはServiceにおけるデフォルト設定であり、明示的に記載が無ければ`type: ClusterIP`が設定されることに注意してください。

> 【サービスタイプ】
> 
> それぞれのServiceの特徴について簡単に触れます。少し長くなるので講義では`ClusterIP`のみを説明しますが、興味のある人は他のサービスタイプも読んでみてください。
> #### ClusterIP
> ClusterIPによって割り振られるIPアドレスはKubernetesクラスター内でのみ有効です。主にクラスター外からアクセスする必要のない箇所などでクラスター内ロードバランスをする際に利用されます。
> ![ClusterIP](./images/image_clusterip.svg)
> 
> #### NodePort
> ClusterIPを作った上で、全node各々の`<ip address:port>`で受信したアクセスをServiceへ転送することで、クラスタ外からアクセスできるようにします。Docker Swarmでいうところの`Expose`です。図では全Kubernetes nodeの`port:30080`へのアクセスを`NodePort Service`に転送しています。
> ![NodePort](./images/image_nodeport.svg)
> 
> #### LoadBalancer
> Kubernetesクラスター外のロードバランサーより払い出された仮想IPアドレスを利用してクラスター外からのアクセスを可能にします。NodePortでは各nodeに`<node ip>:<node port>`が割り振られ、ユーザはいずれかのアドレス宛にアクセスするため、アクセスしているnodeで障害が起きた際にそのnodeを利用しているユーザはサービスを利用できなくなります。それに対して`type: LoadBalancer`は、ユーザがクラスター外のロードバランサーから払い出されたIPアドレスのみを知っておくだけでサービスを利用することができます。また、nodeで障害が起きてもそのnodeの切り離しを行うようにクラスター外のロードバランサーを設定することで、ユーザはサービスを継続して利用することができます(ただし従来のロードバランサー＋仮想マシンの組み合わせ同様に、障害検知から除外までの間は通信断が発生します)。ここでいうクラスター外のロードバランサーはプロバイダに依存しており、たとえばGCPの場合はGCLBが使われています。
> ![LoadBalancer](./images/image_loadbalancer.svg)

それでは同じようにapplyしてから`Service`の稼働状況を確認します。

```bash
$ kubectl apply -f service.yml
service/bootcamp-svc created
$ kubectl get svc
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
bootcamp-svc   ClusterIP   xxx.xxx.xxx.xxx   <none>        80/TCP    1h
```

次に実際にPodにアクセスしてみましょう。`kubectl proxy`でコントロールプレーンのAPIサーバにポートフォワーディングします。先ほども説明しましたが`type: ClusterIP`は外から直接アクセスができません。そのため手元のホストからコントロールプレーンまでをポートフォワードし、コントロールプレーンからPodまでをREST APIを使って通信させます。

```
$ kubectl proxy
Starting to serve on 127.0.0.1:8001
```

このプロキシ機能はServiceへのアクセスをRESTとして`/api/v1/namespaces/<namespace>/services/<scheme>:<service>:<port>/proxy/`と表現しているため、今回は`http://127.0.0.1:8001/api/v1/namespaces/<your namespace>/services/bootcamp-svc/proxy/`へアクセスすることでコンテンツを取得することができます。

> `<your namespace>`にはIKEで払い出したnamespaceを入力します。
> namespaceがわからない場合は`kubectl config get-contexts`から探してください。`CURRENT`に米印が付いているものがいま作業しているコンテキストになります。もし`NAMESPACE`の欄に何もなければ`namespace: default`ということになります。  
> ```
> $ kubectl config get-contexts
> CURRENT   NAME                CLUSTER    AUTHINFO   NAMESPACE
>           minikube            minikube   nirazuka
> *         nira                nirakube   nirazuka   nirazuka
> ```

katacodeを使っている場合、RESTを辿ることができないため`kubectl port-foward`を利用します。`kubectl port-foward`はローカルのポートをPodやServiceに直接フォワーディングすることができます。
```
$ kubectl port-forward service/bootcamp-svc --address=0.0.0.0 :80
Forwarding from 0.0.0.0:35715 -> 8080
```
あとはTerminal横の「＋」ボタンから「select port to view on Host 1」を選択し、表示されているポートへアクセスすればコンテンツを取得することができます。


`Hello Kubernetes!` が表示されたでしょうか。無事にpodにアクセスすることができました。

> 今回はServiceでアプリケーションを公開しましたが、本来はServiceの上にIngressを作って公開することが推奨されています。
> Ingressを利用するとSSLの設定やVirtualHostの設定などを行えるようになります。
> 興味のある方は[公式ページ](https://kubernetes.io/ja/docs/concepts/services-networking/ingress/)を参考に触ってみて下さい。

### 3-4. Podを削除してみる

試しに手動で無理やりpodを削除してみましょう。`kubectl get pods -w`で確認しながら、以下のコマンドでpodを削除してみます。

```bash
$ kubectl delete pods <pod-name>
```

例によってpod-nameはコピペしてください。`kubectl get pods -w`しているとPodの数が`replicas`の設定値に合うように新しく起動される様子が分かります。

```bash
$ kubectl get pods -w
NAME                        READY   STATUS    RESTARTS   AGE
bootcamp-6bcddb7cf8-jpzg5   1/1     Running   0          23m
bootcamp-6bcddb7cf8-tq2fs   1/1     Running   0          23m
bootcamp-6bcddb7cf8-jpzg5   1/1     Terminating   0          23m
bootcamp-6bcddb7cf8-ffj7f   0/1     Pending       0          0s
bootcamp-6bcddb7cf8-ffj7f   0/1     Pending       0          0s
bootcamp-6bcddb7cf8-ffj7f   0/1     ContainerCreating   0          0s
bootcamp-6bcddb7cf8-ffj7f   1/1     Running             0          7s
bootcamp-6bcddb7cf8-jpzg5   0/1     Terminating         0          23m
```

`bootcamp-6bcddb7cf8-jpzg5`が手動で削除したpodです。`bootcamp-6bcddb7cf8-jpzg5`の削除が始まった途端に新しく`bootcamp-6bcddb7cf8-ffj7f`というpodを立てようとしているのが分かります。

このようにpodがエラーで停止したり、新しいアプリのデプロイなどでpodを停止してもすぐさま`ReplicaSet`が状態を修復してくれます。
それだけではなく、前段の`Service`がpodの状態を監視しながら通信を流す先を決めてくれるため、一部のpodが停止している間も自動的に生きているpodに通信を流してくれます。

そのためユーザーに一切影響なくpodの停止と復旧が全て自動で可能になっています。このようなインフラをKubernetesとコンテナなしで構築するのはかなり困難です。

## 4. 最後に

Kubernetesの紹介と代表的なオブジェクトである`Deployment`と`Service`について簡単に触ってみました。
Kubetenetesでは他にも様々なオブジェクトや設定を使います。

例えば

- アプリの環境変数を設定するために`env`を使う
- データベースなどステートフルなpodを稼働させるために`StatefulSet`を使う
- データの永続化のため`PersistentVolume`や`PersistentVolumeClaim`を使う
- アプリのコンフィグファイルを管理するのに`ConfigMap`を使う
- APIキーやパスワードなど秘密情報を扱うために`Secret`を使う(ただしキー値はbase64でエンコードされた文字列)

などなどです。`PersistentVolume`や`PersistentVolumeClaim`などはディストリビューションごとに扱い方が違ったりしますし、構築したいアプリによってマニフェストファイルの書き方は様々なので今回は割愛しました。

社内でKubetenetesを使ってアプリを構築する場合はIKEが使いやすいかと思いますので、ぜひチュートリアルなどを眺めてみてください。


> 【参考文献】
> 1. Kubernetes完全ガイド/青山信也(インプレス)
> 2. イラストでわかるDockerとKubernetes/徳永航平(技術評論社)
> 3. Docker/Kubernetes実践コンテナ開発入門/山田明憲(技術評論社)
> 4. [Kubernetes公式ドキュメント](https://kubernetes.io/)/CNCF
