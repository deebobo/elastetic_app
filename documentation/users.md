## Classes

<dl>
<dt><a href="#Users">Users</a></dt>
<dd><p>represents the users collection</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#.add_new">.add()</a> ⇒ <code>Promise</code></dt>
<dd><p>adds a user to the db</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a single record by id</p>
</dd>
</dl>

<a name="Users"></a>

## Users
represents the users collection

**Kind**: global class  
<a name="new_Users_new"></a>

### new Users(collection)

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>object</code> | a reference to the mongo collection that represents the users |

<a name=".add_new"></a>

## .add() ⇒ <code>Promise</code>
adds a user to the db

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record thatwas added  

| Param | Type | Description |
| --- | --- | --- |
| `user` | <code>Object</code> | details about the user. |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a single record by id

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record thatwas added  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | id of the user record. |

