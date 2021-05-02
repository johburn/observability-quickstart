all: build deploy

build: build-hello-service build-format-service build-people-service

build-hello-service:
	@echo "Building Hello Service..........";\
    eval $$(minikube docker-env) ;\
	cd services/hello-service && docker build -t hello-service .

build-format-service:
	@echo "Building Format Service..........";\
	eval $$(minikube docker-env) ;\
	cd services/format-service && docker build -t format-service .

build-people-service:
	@echo "Building People Service..........";\
	eval $$(minikube docker-env) ;\
	cd services/people-service && docker build -t people-service .

deploy:
	kubectl apply -f k8s/namespace.yml
	kubectl create secret generic mysql-credentials --from-literal=username=root --from-literal=password=admin --from-literal=datasource="exporter:exportpass@(localhost:3306)/tutorial" -n applications --dry-run=client -o yaml | kubectl apply -f -
	kubectl apply -f k8s/mysql.yml
	kubectl apply -f k8s/deployment.yml
	kubectl apply -f k8s/config/prometheus/servicemonitoring.yml

deploy-prometheus:
	kubectl create namespace observability
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo update
	helm install prometheus prometheus-community/kube-prometheus-stack --namespace observability


delete-pods:
	kubectl delete po -l app=hello-service -n applications
	kubectl delete po -l app=people-service -n applications
	kubectl delete po -l app=format-service -n applications

load-test:
	ab -k -c 100 -n 20000 localhost:8080/sayHello/iroh

clean:
	kubectl delete -f k8s/config/prometheus/servicemonitoring.yml
	kubectl delete -f k8s/deployment.yml
	kubectl delete -f k8s/mysql.yml
	kubectl delete secret mysql-credentials -n applications
	kubectl delete -f k8s/namespace.yml
	helm uninstall prometheus -n observability
	kubectl delete crd alertmanagerconfigs.monitoring.coreos.com
	kubectl delete crd alertmanagers.monitoring.coreos.com
	kubectl delete crd podmonitors.monitoring.coreos.com
	kubectl delete crd probes.monitoring.coreos.com
	kubectl delete crd prometheuses.monitoring.coreos.com
	kubectl delete crd prometheusrules.monitoring.coreos.com
	kubectl delete crd servicemonitors.monitoring.coreos.com
	kubectl delete crd thanosrulers.monitoring.coreos.com
	kubectl delete namespace observability

