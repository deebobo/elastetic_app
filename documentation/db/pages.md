## Classes

<dl>
<dt><a href="#creates the collection that stores all the pages for each site.
required fields_
 - name_ the name of the page
	- site_ the site to which this group applies
 - content_ the content of the page
 - groups_ the groups that have access to this page.
 - partial_ the index nr of the partial from the plugin that is the main entry point.
 - controller_ name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
 - createdOn_ date of record creation">creates the collection that stores all the pages for each site.
required fields:
 - name: the name of the page
	- site: the site to which this group applies
 - content: the content of the page
 - groups: the groups that have access to this page.
 - partial: the index nr of the partial from the plugin that is the main entry point.
 - controller: name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
 - createdOn: date of record creation</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a page definition</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a page by name for a specific site.</p>
</dd>
<dt><a href="#.delete_new">.delete()</a> ⇒ <code>Promise</code></dt>
<dd><p>removes a page.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#mongoose">mongoose</a></dt>
<dd><p>Created by Deebobo.dev on 25/05/2017.
copyright 2017 Deebobo.dev
See the COPYRIGHT file at the top-level directory of this distribution</p>
</dd>
</dl>

<a name="creates the collection that stores all the pages for each site.
required fields_
 - name_ the name of the page
	- site_ the site to which this group applies
 - content_ the content of the page
 - groups_ the groups that have access to this page.
 - partial_ the index nr of the partial from the plugin that is the main entry point.
 - controller_ name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
 - createdOn_ date of record creation"></a>

## creates the collection that stores all the pages for each site.
required fields:
 - name: the name of the page
	- site: the site to which this group applies
 - content: the content of the page
 - groups: the groups that have access to this page.
 - partial: the index nr of the partial from the plugin that is the main entry point.
 - controller: name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
 - createdOn: date of record creation
**Kind**: global class  
<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a page definition

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `page` | <code>Object</code> | see add for more info |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a page by name for a specific site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | name of the page. |
| site | <code>string</code> | name of the site. |

<a name=".delete_new"></a>

## .delete() ⇒ <code>Promise</code>
removes a page.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | the id of the object that needs to be deleted. |

<a name="mongoose"></a>

## mongoose
Created by Deebobo.dev on 25/05/2017.
copyright 2017 Deebobo.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
