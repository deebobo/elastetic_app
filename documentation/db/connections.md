## Classes

<dl>
<dt><a href="#Connections">Connections</a></dt>
<dd><p>represents the collection of connection</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#.add_new">.add()</a> ⇒ <code>Promise</code></dt>
<dd><p>adds a connection definition to the db</p>
</dd>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a connection definition to the db</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a connection for a specific site.</p>
</dd>
<dt><a href="#.findById_new">.findById()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a connection by it&#39;s id</p>
</dd>
<dt><a href="#.delete_new">.delete()</a> ⇒ <code>Promise</code></dt>
<dd><p>removes a connection for a specific site.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#mongoose">mongoose</a></dt>
<dd><p>Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution</p>
</dd>
</dl>

<a name="Connections"></a>

## Connections
represents the collection of connection

**Kind**: global class  

* [Connections](#Connections)
    * [new Connections(collection)](#new_Connections_new)
    * [.list(site, plugin)](#Connections+list) ⇒ <code>Promise</code>

<a name="new_Connections_new"></a>

### new Connections(collection)

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>object</code> | a reference to the mongo collection that represents the connections |

<a name="Connections+list"></a>

### connections.list(site, plugin) ⇒ <code>Promise</code>
Get a list of all the available connections for a site.

**Kind**: instance method of [<code>Connections</code>](#Connections)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the list of connections  

| Param | Type | Description |
| --- | --- | --- |
| site | <code>string</code> | name of the site. |
| plugin | <code>string</code> | optional id of the plugin to filter on. |

<a name=".add_new"></a>

## .add() ⇒ <code>Promise</code>
adds a connection definition to the db

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `template` | <code>Object</code> | details about the connection. The object should contain the following fields: 	- name: the name of the template. 	- site: the site on which the email template was created 	- connection: id of the plugin 	- content: object for the config of the connection. |

<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a connection definition to the db

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `connection` | <code>Object</code> | details about the connection. The object should contain the following fields: 	- name: the name of the template. 	- site: the site on which the email template was created 	- connection: id of the plugin 	- content: object for the config of the connection. |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a connection for a specific site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | nameof the connection. |
| site | <code>string</code> | name of the site. |

<a name=".findById_new"></a>

## .findById() ⇒ <code>Promise</code>
finds a connection by it's id

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | id  the connection. |

<a name=".delete_new"></a>

## .delete() ⇒ <code>Promise</code>
removes a connection for a specific site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | the id of the object that needs to be deleted. |

<a name="mongoose"></a>

## mongoose
Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
