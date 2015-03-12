//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TypeCheck' ];

//-----------------------------------------------------------------------------
/**
 * Module to perform different types of type checks of values.
 *
 * @namespace
 * @name TypeCheck
 *
 */
var TypeCheck = function() {
    var OBJECT_TYPE = "object";
    var STRING_TYPE = "string";

    function isType( arg, typeName ) {
        return typeof( arg ) === typeName;
    }

    function checkType( arg, typeName, message ) {
        return __checkResult( isType( arg, typeName ), message );
    }

    function isObject( arg ) {
        return isType( arg, OBJECT_TYPE );
    }

    function checkObject( arg, message ) {
        checkType( arg, OBJECT_TYPE, message );
    }

    function isString( arg ) {
        return isType( arg, STRING_TYPE );
    }

    function checkString( arg, message ) {
        checkType( arg, STRING_TYPE, message );
    }

    function instanceOf( arg, type ) {
        return isObject( arg ) && arg instanceof type;
    }

    function isArray( arg ) {
        return instanceOf( Array );
    }

    function checkArray( arg, message ) {
        return __checkResult( isArray( arg ), message );
    }

    function hasProperty( arg, propName ) {
        return arg.hasOwnProperty( propName );
    }

    function checkProperty( arg, propName, message ) {
        return __checkResult( arg.hasOwnProperty( propName ), message );
    }

    function __checkResult( result, message ) {
        if( result === false ) {
            throw message;
        }
    }

    return {
        'isType': isType,
        'checkType': checkType,
        'isObject': isObject,
        'checkObject': checkObject,
        'isString': isString,
        'checkString': checkString,
        'instanceOf': instanceOf,
        'isArray': isArray,
        'checkArray': checkArray,
        'hasProperty': hasProperty,
        'checkProperty': checkProperty
    }

}();
