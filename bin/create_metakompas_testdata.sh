#!/bin/ksh
#
# This shell script takes a request record with metakompas data as input and creates
# necessary solr wiremock files, a file with id numbers used in numberroll mocking,
# expected subject record files and a file with the corresponding tc rawrepo expected
# section.
# Generated data will be found in a new folder "new" - NB remember to delete this folder
# before running the test again - ocb-test get a little annoyed over some of the content.
#
# Cleanup afterwards may be necessary - f.ex. multiple 665 with *&<something> will create
# messy 565's
#
# Do not use spaces in front/back of 665 subfields and do not use æøå in the content of these.
# The spaces are ignored but are messy to handle in this script.
# The æøå chars gives problems in the url matching in wiremock.
#
# If there are no __wiremock in the testcase, then remember to copy body-002a-nohits.json
# and mapping-002a-nohits.json from some other testcase - it will be needed.
#
# copy :
#       new/id_numbers -> <testcase>/__wiremock/solr
#       new/expected*  -> <testcase>/
#       new/mappings/* -> <testcase>/__wiremock/solr/mappings
#       new/__files/*  -> <testcase>/__wiremock/solr/_files
#
# paste tc_add into the expected->rawrepo section in tc.json

mkdir new
cd new 
mkdir mappings
mkdir __files
rm id_numbers
rm tc_add


function mapping
{
        search=`echo ${2} | sed -e 's/ /\\\\\\\\+/g'`    # this may look weird, but results in \\+ in output.
        file=`echo ${2} | tr -s " " "-"`
echo "{
  \"request\" : {
    \"urlPattern\" : \"/solr/raapost-index/select\\\\?q=phrase\\\\.${1}%3A%22${search}%22\\\\+AND\\\\+marc\\\\.001b%3A190004&wt=json\",
    \"method\" : \"GET\"
  },
  \"response\" : {
    \"status\" : 200,
    \"bodyFileName\" : \"body-${1}-${file}.json\",
    \"headers\" : {
      \"Server\" : \"Apache-Coyote/1.1\",
      \"Content-Type\" : \"text/plain;charset=UTF-8\",
      \"Transfer-Encoding\" : \"chunked\",
      \"Date\" : \"Wed, 01 Oct 2014 13:17:48 GMT\"
    }
  }
}" > mappings/mapping-${1}-${file}.json
}

function body 
{
        search=`echo ${2} | sed -e 's/ /\\\\\\\\+/g'`    # this may look weird, but results in \\+ in output.
        file=`echo ${2} | tr -s " " "-"`
echo "{
  \"responseHeader\":{
    \"status\":0,
    \"QTime\":0,
    \"params\":{
      \"indent\":\"true\",
      \"q\":\"phrase.${1}:%22${search}%22\",
      \"wt\":\"json\"}},
  \"response\":{\"numFound\":0,\"start\":0,\"docs\":[]
  }}" > __files/body-${1}-${file}.json
}

function common
{
        file=`echo ${3} | tr -s " " "-"`
echo "001 00*a${4}*b190004*c20080125114024*d20080125*fa*tFAUST
004 00*rn*ae*xm
008 00*th*v0
040 00*bdan*fDBC
165 00*${2}${3}" > expected-${file}-common.marc
if [ "${2}" == "n" ]
then
        echo "565 00*n${6}*xBT" >> expected-${file}-common.marc
fi
echo "670 00*a${5}
996 00*aDBC" >> expected-${file}-common.marc
}

function enrich
{
        file=`echo ${3} | tr -s " " "-"`
echo "001 00*a${4}*b191919*c20080125114024*d20080125*fa*tFAUST
004 00*rn*ae*xm
d08 00*aMetakompas
d09 00*zEMK201919
x08 00*ps
x09 00*p${1}" > expected-${file}-enrichment.marc
}

function tc_add
{
        file=`echo ${1} | tr -s " " "-"`
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
}," >> tc_add
}

common_id=`egrep '^001' ../$1 | tr -s "*" "\012" | egrep '^a' | tr -d " " | cut -c2-`
overkat=`egrep '^665' ../$1 | tr -s "*" "\012" | egrep '^&' | egrep -v '[Ll][Ee][Kk][Tt][Oo][Rr]' | cut -c2-`
egrep '^665' ../$1 | egrep '&[Ll][Ee][Kk][Tt][Oo][Rr]' | tr -s "*" "\012" | egrep -v '^&' | egrep '^i|^q|^p|^m|^g|^u|^e|^h|^j|^k|^l|^s|^r|^t|^n' > subfields

id=80000000
cat subfields | while read line ;
do
        echo $id >> id_numbers
        sub=`echo $line |cut -c1`
        content=`echo $line |cut -c2-`
        # create mapping
        if [ "$sub" == "n" ]
        then
                index="vln";
                newsub="n"
        else
                index="vla"
                newsub="a"
        fi
        mapping $index "$content"
        body $index "$content"
        common $sub $newsub "$content" "$id" "$common_id" "$overkat"
        enrich $sub $newsub "$content" "$id" "$common_id" "$overkat"
        tc_add "$content"

        id=$((($id+1)))

done







