#!groovy

def workerNode = "devel10"

void notifyOfBuildStatus(final String buildStatus) {
    final String subject = "${buildStatus}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    final String details = """<p> Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
    emailext(
            subject: "$subject",
            body: "$details", attachLog: true, compressLog: false,
            mimeType: "text/html",
            recipientProviders: [[$class: "CulpritsRecipientProvider"]]
    )
}

pipeline {
    agent { label workerNode }

    tools {
        maven "Maven 3"
    }

    triggers {
        pollSCM("H/03 * * * *")
        upstream(upstreamProjects: "Docker-payara6-bump-trigger",
                threshold: hudson.model.Result.SUCCESS)
    }

    options {
        timestamps()
        lock('meta-opencat-business-systemtest')
    }

    environment {
        ARTIFACTORY_LOGIN = credentials("artifactory_login")
        ARTY_URL = "https://artifactory.dbccloud.dk/artifactory/generic-metascrum-production/opencat-business/${BUILD_NUMBER}"
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
        DOCKER_IMAGE_NAME = "docker-metascrum.artifacts.dbccloud.dk/opencat-business"
        DOCKER_IMAGE_VERSION = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
        OCBTEST_EXECUTABLE = "java -jar target/dist/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar"
    }

    stages {
        stage("Clean Workspace") {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage("Verify") {
            steps {
                script {
                    String state = 'FAILED'
                    try {
                        sh "mvn verify pmd:pmd"
                        sh """
                            ${OCBTEST_EXECUTABLE} js-tests
                            ./bin/deploy-systemtests.sh false
                        """
                        state = 'UNSTABLE'
                        sh "${OCBTEST_EXECUTABLE} run -c testrun --summary"
                    } catch (error) {
                        currentBuild.result = state
                    } finally {
                        sh """
                            mkdir logs
                            docker logs isworker_ocb_updateservice-facade_1 > logs/updateservice-facade.log 2>&1
                            docker logs isworker_ocb_updateservice_1 > logs/updateservice.log 2>&1
                            docker logs isworker_ocb_opencat-business-service_1 > logs/opencat-business-service.log 2>&1
                            docker logs isworker_ocb_rawrepo-record-service_1 > logs/rawrepo-record-service.log 2>&1
                        """

                        archiveArtifacts(artifacts: "logs/*.log", onlyIfSuccessful: false, fingerprint: true)
                    }
                }

                junit "**/TEST-*.xml,**/target/failsafe-reports/TEST-*.xml"
            }
        }

        stage("Publish PMD Results") {
            steps {
                step([$class          : 'hudson.plugins.pmd.PmdPublisher',
                      pattern         : '**/target/pmd.xml',
                      unstableTotalAll: "0",
                      failedTotalAll  : "0"])
            }
        }

        stage("Archive artifacts") {
            when {
                expression {
                    currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}", "./target/docker")
                    image.push()

                    if (env.BRANCH_NAME == 'master') {
                        sh """
                            docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} ${DOCKER_IMAGE_NAME}:latest
                            docker push ${DOCKER_IMAGE_NAME}:latest

                            curl -u ${ARTIFACTORY_LOGIN_USR}:${ARTIFACTORY_LOGIN_PSW} -T deploy/opencat-business.tar.gz ${ARTY_URL}/opencat-business.tar.gz
                        """
                        archiveArtifacts(artifacts: "deploy/*.tar.gz")
                    }
                }
            }
        }

        stage("Bump image-versions in opencat-business-secrets") {
            agent {
                docker {
                    label workerNode
                    image "docker-dbc.artifacts.dbccloud.dk/build-env:latest"
                    alwaysPull true
                }
            }
            when {
                expression {
                    currentBuild.result == 'SUCCESS' && env.BRANCH_NAME == 'master'
                }
            }
            steps {
                script {
                    sh """
                     set-new-version services ${env.GITLAB_PRIVATE_TOKEN} metascrum/opencat-business-secrets master-${env.BUILD_NUMBER} -b metascrum-staging
                     set-new-version services ${env.GITLAB_PRIVATE_TOKEN} metascrum/opencat-business-secrets master-${env.BUILD_NUMBER} -b fbstest
                     set-new-version services ${env.GITLAB_PRIVATE_TOKEN} metascrum/opencat-business-secrets master-${env.BUILD_NUMBER} -b basismig
                     set-new-version services/opencat-business-tmpl.yml ${env.GITLAB_PRIVATE_TOKEN} metascrum/dit-gitops-secrets master-${env.BUILD_NUMBER} -b master
                """
                }
            }
        }

    }
    post {
        unstable {
            notifyOfBuildStatus("Jenkins build became unstable")
        }
        failure {
            notifyOfBuildStatus("Jenkins build failed")
        }
        fixed {
            notifyOfBuildStatus("Jenkins build is back to normal")
        }
        always {
            sh "./bin/stop-systemtests.sh"
            cleanWs()
        }
    }
}
