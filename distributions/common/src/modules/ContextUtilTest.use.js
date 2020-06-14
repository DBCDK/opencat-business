use("ContextUtil");
use("ResourceBundle");

UnitTest.addFixture("ContextUtil.getValue", function () {
    var a = 'a'
    var e = 'e'
    var d = {
        'e': e
    }
    var c = {
        'c': 'c',
        'd': d
    }
    var b = {
        'b': 'b',
        'c': c
    }
    var context = {
        'a': a,
        'b': b
    };

    // Normal arguments
    Assert.equalValue("getValue 01", ContextUtil.getValue(context, "z"), undefined);
    Assert.equalValue("getValue 02", ContextUtil.getValue(context, "z", "z"), undefined);
    Assert.equalValue("getValue 03", ContextUtil.getValue(context), context);
    Assert.equalValue("getValue 04", ContextUtil.getValue(context, "a"), "a");
    Assert.equalValue("getValue 05", ContextUtil.getValue(context, "a", "z"), undefined);
    Assert.equalValue("getValue 06", ContextUtil.getValue(context, "b"), b);
    Assert.equalValue("getValue 07", ContextUtil.getValue(context, "b", "c"), c);
    Assert.equalValue("getValue 08", ContextUtil.getValue(context, "b", "z"), undefined);
    Assert.equalValue("getValue 09", ContextUtil.getValue(context, "b", "c", "d"), d);
    Assert.equalValue("getValue 10", ContextUtil.getValue(context, "b", "c", "z"), undefined);
    Assert.equalValue("getValue 11", ContextUtil.getValue(context, "b", "c", "d", "e"), e);

    // Weird arguments
    Assert.equalValue("getValue 12", ContextUtil.getValue(context, -1), undefined);
    Assert.equalValue("getValue 13", ContextUtil.getValue(context, undefined), undefined);
    Assert.equalValue("getValue 14", ContextUtil.getValue(context, null), undefined);

    // Key as array
    context = {
        "FieldDemandsOtherFieldAndSubfield": {
            "770": {
                "795": {
                    "a": []
                }
            }
        }
    }

    var subfields = ['a'];
    Assert.equalValue("getValue 15", ContextUtil.getValue(context, 'FieldDemandsOtherFieldAndSubfield', "770", "795", subfields.join()), []);

    context = {
        "FieldDemandsOtherFieldAndSubfield": {
            "770": {
                "795": {
                    "a,b": ["test"]
                }
            }
        }
    }

    subfields = ['a', 'b'];
    Assert.equalValue("getValue 16", ContextUtil.getValue(context, 'FieldDemandsOtherFieldAndSubfield', "770", "795", subfields.join()), ["test"]);
});
UnitTest.addFixture("ContextUtil.setValue", function () {
    var context = {};
    ContextUtil.setValue(context, "a", "a");
    Assert.equalValue("setValue 01", context, {"a": "a"});

    context = {"a": "a"};
    ContextUtil.setValue(context, "b", "a");
    Assert.equalValue("setValue 01", context, {"a": "b"});

    context = {};
    ContextUtil.setValue(context, [1, 2, 3], "a");
    Assert.equalValue("setValue 01", context, {"a": [1, 2, 3]});

    context = {};
    ContextUtil.setValue(context, {"c": "d"}, "a");
    Assert.equalValue("setValue 01", context, {"a": {"c": "d"}});

    context = {};
    ContextUtil.setValue(context, "a", "a", "b");
    Assert.equalValue("setValue 02", context, {"a": {"b": "a"}});

    context = {"a": {"b": "a"}};
    ContextUtil.setValue(context, "c", "a", "b");
    Assert.equalValue("setValue 02", context, {"a": {"b": "c"}});
});