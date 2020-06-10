#!groovy

def workerNode = "devel8"

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

    triggers {
        pollSCM("H/03 * * * *")
    }

    options {
        timestamps()
    }

    stages {
        stage("Clear workspace") {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage("Run scripts") {
            steps {
                lock('meta-opencat-business-systemtest') {
                    sh "./bin/run-js-tests.sh ${env.GIT_COMMIT}"
                    sh "./bin/deploy-systemtests.sh"
                    sh "./bin/run-ocb-tests.sh"
                    sh "./bin/create_artifact_tarball.sh ${env.GIT_COMMIT}"
                }
            }
        }

        stage("Archive artifacts") {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                archiveArtifacts(artifacts: "deploy/*.tar.gz")
            }
        }

        stage("jUnit") {
            steps {
                junit("TEST-*.xml,target/surefire-reports/TEST-*.xml")
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