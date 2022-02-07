FROM docker.dbc.dk/payara5-micro:latest

ENV JAVASCRIPT_BASEDIR /opt/payara5/deployments/opencat-business
ENV JAVASCRIPT_POOL_SIZE 1

ENV VIPCORE_ENDPOINT http://vipcore.iscrum-vip-extern-test.svc.cloud.dbc.dk
ENV VIPCORE_CACHE_AGE 8

ENV SOLR_URL empty

ENV RAWREPO_RECORD_SERVICE_URL empty

ENV DOUBLE_RECORD_MAIL_HOST empty
ENV DOUBLE_RECORD_MAIL_PORT empty
ENV DOUBLE_RECORD_MAIL_USER empty
ENV DOUBLE_RECORD_MAIL_PASSWORD empty
ENV DOUBLE_RECORD_MAIL_FROM empty
ENV DOUBLE_RECORD_MAIL_RECIPIENT empty

LABEL INSTANCE_NAME="Name of the updateservice instance. Default is blank (Optional)"
LABEL MAINTAINER="meta-scrum@dbc.dk"

COPY app.json *.war deployments/
ADD opencat-business.tar.gz deployments/
