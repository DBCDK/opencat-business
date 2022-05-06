ARG UPDATE_PAYARA_DEPLOYER_DOCKER_TAG
FROM docker-metascrum.artifacts.dbccloud.dk/update-payara-deployer:$UPDATE_PAYARA_DEPLOYER_DOCKER_TAG

COPY distributions/ /opt/payara5/deployments/opencat-business/distributions

USER root
RUN chown -R $PAYARA_USER:$PAYARA_USER /opt/payara5/deployments/opencat-business/distributions
USER $PAYARA_USER

# ARG must be specified again because an ARG placed before the FROM
# instruction runs outside of the build stage
ARG UPDATE_PAYARA_DEPLOYER_DOCKER_TAG
LABEL UPDATESERVICE_VERSION=$UPDATE_PAYARA_DEPLOYER_DOCKER_TAG

