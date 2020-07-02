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
        upstream(upstreamProjects: "Docker-payara5-bump-trigger",
                threshold: hudson.model.Result.SUCCESS)
    }

    options {
        timestamps()
    }

    environment {
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
        DOCKER_IMAGE_NAME = "docker-io.dbc.dk/opencat-business"
        DOCKER_IMAGE_VERSION = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
        DOCKER_IMAGE_DIT_VERSION = "DIT-${env.BUILD_NUMBER}"
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
                sh "mvn verify pmd:pmd"
                lock('meta-opencat-business-systemtest') {
                    sh "./bin/run-js-tests.sh ${env.GIT_COMMIT}"
                    sh "./bin/deploy-systemtests.sh"
                    sh "./bin/run-ocb-tests.sh"
                }

                junit "**/target/surefire-reports/TEST-*.xml,**/target/failsafe-reports/TEST-*.xml"
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
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh """
                            docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_DIT_VERSION}
                            docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_DIT_VERSION}
                        """
                        archiveArtifacts(artifacts: "deploy/*.tar.gz")
                    }
                }
            }
        }

    }
    post {
        unstable {
            notifyOfBuildStatus("build became unstable")
        }
        failure {
            notifyOfBuildStatus("build failed")
        }
    }
}