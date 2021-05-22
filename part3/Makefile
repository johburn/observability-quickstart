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
	kubectl apply -f k8s/jaeger-config.yml
	kubectl apply -f k8s/deployment.yml

delete-pods:
	kubectl delete po -l app=hello-service -n applications
	kubectl delete po -l app=people-service -n applications
	kubectl delete po -l app=format-service -n applications

deploy-jaeger:
	helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
	helm repo update
	helm install jaeger jaegertracing/jaeger-operator -n observability
	kubectl apply -f k8s/config/jaeger/deployment.yml

clean:
	helm uninstall jaeger -n observability
	kubectl delete -f k8s/deployment.yml
	kubectl delete -f k8s/jaeger-config.yml
