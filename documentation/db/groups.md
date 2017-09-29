<a name="Groups"></a>

## Groups
Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global class  
<a name="new_Groups_new"></a>

### new Groups(collection)

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>object</code> | a reference to the mongo collection that represents the users |

## Classes

<dl>
<dt><a href="#creates the collection that stores the group (authorisation) information
required fields_
 - name_ the name of the group
	- site_ the site to which this group applies
 - level_ the level of access that this group has. Can be one of the following values_
 	- admin_ full access
		- edit_ can edit views
		- view_ can see views
		- public_ items authorized with this view are publicly accessible.
	- keys_
		- (unique) name - site">creates the collection that stores the group (authorisation) information
required fields:
 - name: the name of the group
	- site: the site to which this group applies
 - level: the level of access that this group has. Can be one of the following values:
 	- admin: full access
		- edit: can edit views
		- view: can see views
		- public: items authorized with this view are publicly accessible.
	- keys:
		- (unique) name - site</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a group</p>
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

<a name="creates the collection that stores the group (authorisation) information
required fields_
 - name_ the name of the group
	- site_ the site to which this group applies
 - level_ the level of access that this group has. Can be one of the following values_
 	- admin_ full access
		- edit_ can edit views
		- view_ can see views
		- public_ items authorized with this view are publicly accessible.
	- keys_
		- (unique) name - site"></a>

## creates the collection that stores the group (authorisation) information
required fields:
 - name: the name of the group
	- site: the site to which this group applies
 - level: the level of access that this group has. Can be one of the following values:
 	- admin: full access
		- edit: can edit views
		- view: can see views
		- public: items authorized with this view are publicly accessible.
	- keys:
		- (unique) name - site
**Kind**: global class  
<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a group

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `group` | <code>Object</code> | see add for more details |

<a name="mongoose"></a>

## mongoose
Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
