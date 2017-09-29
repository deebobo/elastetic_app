## Classes

<dl>
<dt><a href="#views">views</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a view definition</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a view by name for a specific site.</p>
</dd>
<dt><a href="#.delete_new">.delete()</a> ⇒ <code>Promise</code></dt>
<dd><p>removes a view.</p>
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

<a name="views"></a>

## views
**Kind**: global class  

* [views](#views)
    * [new views(collection)](#new_views_new)
    * [.add(&#x60;view&#x60;)](#views+add) ⇒ <code>Promise</code>
    * [.list(&#x60;site&#x60;)](#views+list) ⇒ <code>Promise</code>

<a name="new_views_new"></a>

### new views(collection)

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>object</code> | a reference to the mongo collection that represents the views |

<a name="views+add"></a>

### views.add(&#x60;view&#x60;) ⇒ <code>Promise</code>
adds a view to the db

**Kind**: instance method of [<code>views</code>](#views)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `view` | <code>Object</code> | details about the view. The object should contain the following fields: 	- name: the name of the group.  	- site: the site to which the group belongs  - plugin: ref to the plugin that needs to be used  - partial: nr of the partial to use as main  - controller: the name of the controller to use.  - groups: the groups for this view to determine the access. |

<a name="views+list"></a>

### views.list(&#x60;site&#x60;) ⇒ <code>Promise</code>
Returns all the views for a particular site, without the actual content.
		fields returned:
		- name
		- id
		- createdOn
		- groups

**Kind**: instance method of [<code>views</code>](#views)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the list of groups  

| Param | Type | Description |
| --- | --- | --- |
| `site` | <code>string</code> | The name of the site to list the groups for. |

<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a view definition

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `view` | <code>Object</code> | see add for more info |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a view by name for a specific site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | name of the view. |
| site | <code>string</code> | name of the site. |

<a name=".delete_new"></a>

## .delete() ⇒ <code>Promise</code>
removes a view.

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
