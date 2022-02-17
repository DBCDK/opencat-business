#!/bin/ksh
set -x
#
# This shell script takes a request record with metakompas data as input and creates
# necessary solr wiremock files, a file with id numbers used in numberroll mocking,
# expected subject record files and a file with the corresponding tc rawrepo expected
# section.
# Generated data will be found in a new folder "new" - NB remember to delete this folder
# before running the test again - ocb-test get a little annoyed over some of the content.
#
# Cleanup afterwards may be necessary
# f.ex. multiple 665 with *&<something> will create messy 565's - this might be fixed with loops
#
# Do not use spaces in front/back of 665 subfields and do not use æøå in the content of these.
# The spaces are ignored but are messy to handle in this script.
# The æøå chars gives problems in the url matching in wiremock.
#
# If there are no __wiremock in the testcase, then remember to copy body-002a-nohits.json
# and mapping-002a-nohits.json from some other testcase - it will be needed.
#
# If is is necessary to have both update and create operations in a testcase then run
# an UPDATE, modify numFound and docs part in the relevant __files files and remove
# the corresponding current-<subject>-*.marc files and modify the tc.json file accordingly
#
# copy :
#       new/id_numbers -> <testcase>/__wiremock/solr
#       new/expected*  -> <testcase>/
#       new/mappings/* -> <testcase>/__wiremock/solr/mappings
#       new/__files/*  -> <testcase>/__wiremock/solr/_files
#
# paste tc_add into the expected->rawrepo section in tc.json
#
# Call :
# without updating of subject records : create_metakompas_testdata.sh request.marc
# including update of subject records : create_metakompas_testdata.sh request.marc UPDATE

mkdir new
cd new
mkdir mappings
mkdir __files
rm id_numbers
rm tc_add
rm tc_add_current

request_file=${1}
create_update=${2:-"NO"}
shortValue=""
export number_roll=80000000

get_number() {
  set -x

  add_id=${1}
  number_roll=$(((${number_roll} + 1)))
  if [ "${add_id}" == "Y" ]
  then
    echo ${number_roll} >>id_numbers
  fi
}

get_code() {
  set -x
  subfieldContent=${1}
  shortValue=""
  case ${subfieldContent} in
  "positiv")
    shortValue="na"
    ;;
  "humoristisk")
    shortValue="nb"
    ;;
  "romantisk")
    shortValue="nc"
    ;;
  "erotisk")
    shortValue="nd"
    ;;
  "dramatisk")
    shortValue="ne"
    ;;
  "trist")
    shortValue="nf"
    ;;
  "uhyggelig")
    shortValue="ng"
    ;;
  "fantasifuld")
    shortValue="nh"
    ;;
  "tankevækkende")
    shortValue="ni"
    ;;
  esac
}

mapping() {
  index=${1}
  content=${2}
  search=$(echo ${content} | sed -e 's/ /\\\\\\\\+/g') # this may look weird, but results in \\+ in output.
  file=$(echo ${content} | tr -s " " "-")
  echo "{
  \"request\" : {
    \"urlPattern\" : \"/solr/basis-index/select\\\\?q=phrase\\\\.${index}%3A%22${search}%22\\\\+AND\\\\+marc\\\\.001b%3A190004&wt=json&fl=marc.001a\",
    \"method\" : \"GET\"
  },
  \"response\" : {
    \"status\" : 200,
    \"bodyFileName\" : \"body-${index}-${file}.json\",
    \"headers\" : {
      \"Server\" : \"Apache-Coyote/1.1\",
      \"Content-Type\" : \"text/plain;charset=UTF-8\",
      \"Transfer-Encoding\" : \"chunked\",
      \"Date\" : \"Wed, 01 Oct 2014 13:17:48 GMT\"
    }
  }
}" >mappings/mapping-${index}-${file}.json
}

body() {
  index=${1}
  content=${2}
  body_id=${3}
  search=$(echo ${content} | sed -e 's/ /\\\\\\\\+/g') # this may look weird, but results in \\+ in output.
  file=$(echo ${content} | tr -s " " "-")
  if [ "${create_update}" == "NO" ]; then
    addon="\"response\":{\"numFound\":0,\"start\":0,\"docs\":[]"
  else
    addon="\"response\":{\"numFound\":1,\"start\":0,\"docs\":[{\"marc.001a\":\"${body_id}\"}]"
  fi
  echo "{
  \"responseHeader\":{
    \"status\":0,
    \"QTime\":0,
    \"params\":{
      \"indent\":\"true\",
      \"q\":\"phrase.${index}:%22${search}%22\",
      \"wt\":\"json\"}},
      ${addon}
  }}" >__files/body-${index}-${file}.json
}

common() {
  set -x
  content=${1}
  common_001id=${2}
  common_id=${3}
  file=$(echo ${content} | tr -s " " "-")
  if [ "${create_update}" == "NO" ]; then
    file_name=expected-${file}-common.marc
    add_common_id=${common_id}
  else
    file_name=current-${file}-common.marc
    add_common_id="21177083"
  fi
  
  echo "001 00*a${common_001id}*b190004*c20080125114024*d20080125*fa
004 00*rn*ae*xm
008 00*th*v0
040 00*bdan*fDBC
165 00*a${content}
670 00*a${add_common_id}
996 00*aDBC" >${file_name}

  if [ "${create_update}" != "NO" ]; then
    file_name=expected-${file}-common.marc
    echo "001 00*a${common_001id}*b190004*c20080125114024*d20080125*fa
004 00*rn*ae*xm
008 00*th*v0
040 00*bdan*fDBC
165 00*a${content}
670 00*a21177083
670 00*a${common_id}
996 00*aDBC" >${file_name}
  fi
}

enrich() {
  set -x
  sub=${1}
  content=${2}
  enrich_id=${3}
  overkat=${4}
  file=$(echo ${content} | tr -s " " "-")
  if [ "${sub}" == "n" ]; then
    get_code ${overkat}
    code_or_sub=${shortValue}
  else
    code_or_sub=${sub}
  fi
  if [ "${create_update}" == "NO" ]; then
    file_name="expected-${file}-enrichment.marc"
    get_number Y
  else
    file_name="current-${file}-enrichment.marc"
    get_number N
  fi
  newid=${number_roll}
  x09add="*p${code_or_sub}*q${newid}"
  echo "001 00*a${enrich_id}*b191919*c20080125114024*d20080125*fa
004 00*rn*ae*xm
d08 00*aMetakompas
d09 00*zEMK201919
x08 00*ps
x09 00${x09add}" > ${file_name}
  if [ "${create_update}" != "NO" ]; then
    file_name=expected-${file}-enrichment.marc
    get_number Y
    realnewid=${number_roll}
    realx09add="*p${code_or_sub}*q${realnewid}"
    echo "001 00*a${enrich_id}*b191919*c20080125114024*d20080125*fa
004 00*rn*ae*xm
d08 00*aMetakompas
d09 00*zEMK201919*zEMK201920
x08 00*ps
x09 00${x09add}
x09 00${realx09add}" > ${file_name}
  fi
}

tc_add() {
  file=$(echo ${1} | tr -s " " "-")
  if [ "${create_update}" != "NO" ]
  then
  echo "{
        \"record\": \"current-${file}-common.marc\",
        \"type\": \"MARCXCHANGE\",
        \"deleted\": false,
        \"enqueued\": false,
        \"enrichments\": [ \"current-${file}-enrichment.marc\" ]
},
{
        \"record\": \"current-${file}-enrichment.marc\",
        \"type\": \"ENRICHMENT\",
        \"enqueued\": true,
        \"deleted\": false
}," >>tc_add_current
  fi
  echo "{
        \"record\": \"expected-${file}-common.marc\",
        \"type\": \"MARCXCHANGE\",
        \"deleted\": false,
        \"enqueued\": true,
        \"enrichments\": [ \"expected-${file}-enrichment.marc\" ]
},
{
        \"record\": \"expected-${file}-enrichment.marc\",
        \"type\": \"ENRICHMENT\",
        \"enqueued\": true,
        \"deleted\": false
}," >>tc_add
}

common_id=$(egrep '^001' ../${request_file} | tr -s "*" "\012" | egrep '^a' | tr -d " " | cut -c2-)

egrep '^665' ../${request_file} | while read f665; do
  overkat=$(echo ${f665} | egrep '^665' | tr -s "*" "\012" | egrep '^&' | egrep -iv 'lektor' | cut -c2-)
  echo ${f665} | egrep '^665' | egrep -i '&lektor' | tr -s "*" "\012" | egrep -v '^&' | egrep '^i|^q|^p|^m|^g|^u|^e|^h|^j|^k|^l|^s|^r|^t|^n' | while read line; do
    echo "MAMBA $line"
    if [ "${create_update}" == "NO" ]
    then
      get_number Y
    else
      get_number N
    fi
    id=${number_roll}
    sub=$(echo $line | cut -c1)
    content=$(echo $line | cut -c2-)
    index="vla"
    # create mapping
    mapping ${index} "${content}"
    body ${index} "${content}" "${id}"
    common "${content}" "${id}" "${common_id}"
    enrich ${sub} "${content}" "${id}" "${overkat}"
    tc_add "${content}"

  done

done
