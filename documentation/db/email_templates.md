## Classes

<dl>
<dt><a href="#EmailTemplates">EmailTemplates</a></dt>
<dd><p>represents the collection of email templates</p>
</dd>
<dt><a href="#creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example_ this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.">creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#.add_new">.add()</a> ⇒ <code>Promise</code></dt>
<dd><p>adds a template to the db</p>
</dd>
<dt><a href="#.update_new">.update()</a> ⇒ <code>Promise</code></dt>
<dd><p>updates an email template</p>
</dd>
<dt><a href="#.find_new">.find()</a> ⇒ <code>Promise</code></dt>
<dd><p>finds a user by name or email for a specific site.</p>
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

<a name="EmailTemplates"></a>

## EmailTemplates
represents the collection of email templates

**Kind**: global class  
<a name="EmailTemplates+list"></a>

### emailTemplates.list() ⇒ <code>Promise</code>
Get a list of all the available templates for a site.

**Kind**: instance method of [<code>EmailTemplates</code>](#EmailTemplates)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the list of plugins  
<a name="creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example_ this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin."></a>

## creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.
**Kind**: global class  
<a name=".add_new"></a>

## .add() ⇒ <code>Promise</code>
adds a template to the db

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `template` | <code>Object</code> | details about the user. The object should contain the following fields: 	- name: the name of the template.  	- site: the site on which the email template was created 	- subject: subject line 	- subject: html body |

<a name=".update_new"></a>

## .update() ⇒ <code>Promise</code>
updates an email template

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `template` | <code>Object</code> | details about the email template. See add for more info |

<a name=".find_new"></a>

## .find() ⇒ <code>Promise</code>
finds a user by name or email for a specific site.

**Kind**: global variable  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was found  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | name or email of the user. |
| site | <code>string</code> | name of the site. |

<a name="mongoose"></a>

## mongoose
Created by Deebobo.dev on 25/05/2017.
copyright 2017 Deebobo.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
