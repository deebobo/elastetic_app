## Classes

<dl>
<dt><a href="#creates the collection that stores the site information
required fields_
 - id_ the name of the group
 - mailhandler_ name of the plugin that handles sending email
 - contactEmail_ the email address of the person that created the site (admin)
	- allowRegistration_ determines if users can register on this site or only through invitation.
	- viewGroup_ provides quick reference to the default view group for registering new users. This values is assigned
   to newly created users as their initial group.
 - createdOn_ date of record creation">creates the collection that stores the site information
required fields:
 - id: the name of the group
 - mailhandler: name of the plugin that handles sending email
 - contactEmail: the email address of the person that created the site (admin)
	- allowRegistration: determines if users can register on this site or only through invitation.
	- viewGroup: provides quick reference to the default view group for registering new users. This values is assigned
   to newly created users as their initial group.
 - createdOn: date of record creation</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates a site definition</p>
</dd>
<dt><a href="#.updatemailHandler_new">.updatemailHandler()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates the mailhandler for the site.</p>
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

<a name="creates the collection that stores the site information
required fields_
 - id_ the name of the group
 - mailhandler_ name of the plugin that handles sending email
 - contactEmail_ the email address of the person that created the site (admin)
	- allowRegistration_ determines if users can register on this site or only through invitation.
	- viewGroup_ provides quick reference to the default view group for registering new users. This values is assigned
   to newly created users as their initial group.
 - createdOn_ date of record creation"></a>

## creates the collection that stores the site information
required fields:
 - id: the name of the group
 - mailhandler: name of the plugin that handles sending email
 - contactEmail: the email address of the person that created the site (admin)
	- allowRegistration: determines if users can register on this site or only through invitation.
	- viewGroup: provides quick reference to the default view group for registering new users. This values is assigned
   to newly created users as their initial group.
 - createdOn: date of record creation
**Kind**: global class  
<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates a site definition

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| 'site' | <code>Object</code> | see add for more details |

<a name=".updatemailHandler_new"></a>

## .updatemailHandler() ⇒ <code>Promise</code>
updates the mailhandler for the site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| 'siteId' | <code>string</code> | id of site |
| 'value' | <code>String</code> | id of of the mailhandler plugin |

<a name="mongoose"></a>

## mongoose
Created by elastetic.dev on 25/05/2017.
copyright 2017 elastetic.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
