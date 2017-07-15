## Classes

<dl>
<dt><a href="#SiteDataCollection">SiteDataCollection</a></dt>
<dd><p>a collection that stores data for a plugin at the level of a site.</p>
</dd>
<dt><a href="#creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example_ this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.">creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#mongoose">mongoose</a></dt>
<dd><p>Created by Deebobo.dev on 25/05/2017.
copyright 2017 Deebobo.dev
See the COPYRIGHT file at the top-level directory of this distribution</p>
</dd>
</dl>

<a name="SiteDataCollection"></a>

## SiteDataCollection
a collection that stores data for a plugin at the level of a site.

**Kind**: global class  

* [SiteDataCollection](#SiteDataCollection)
    * [.add(&#x60;group&#x60;)](#SiteDataCollection+add) ⇒ <code>Promise</code>
    * [.get(&#x60;site&#x60;, &#x60;plugin&#x60;)](#SiteDataCollection+get) ⇒ <code>Promise</code>
    * [.list(&#x60;site&#x60;)](#SiteDataCollection+list) ⇒ <code>Promise</code>

<a name="SiteDataCollection+add"></a>

### siteDataCollection.add(&#x60;group&#x60;) ⇒ <code>Promise</code>
adds a record to the collection.

**Kind**: instance method of [<code>SiteDataCollection</code>](#SiteDataCollection)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the record that
was added  

| Param | Type | Description |
| --- | --- | --- |
| `group` | <code>Object</code> | details about the group. The object should contain the following fields: 	- site: the site to which the group belongs 	- data: a json object with the actual data for the plugin. |

<a name="SiteDataCollection+get"></a>

### siteDataCollection.get(&#x60;site&#x60;, &#x60;plugin&#x60;) ⇒ <code>Promise</code>
Returns the plugin data for a particular site and plugin.

**Kind**: instance method of [<code>SiteDataCollection</code>](#SiteDataCollection)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the data record  

| Param | Type | Description |
| --- | --- | --- |
| `site` | <code>string</code> | The name of the site to list the plugin data for. |
| `plugin` | <code>string</code> | The name of the plugin retrive data for. |

<a name="SiteDataCollection+list"></a>

### siteDataCollection.list(&#x60;site&#x60;) ⇒ <code>Promise</code>
Returns all the plugin data for a particular site.

**Kind**: instance method of [<code>SiteDataCollection</code>](#SiteDataCollection)  
**Returns**: <code>Promise</code> - ] a promise to perform async operations with. The result of the promise is the list of records  

| Param | Type | Description |
| --- | --- | --- |
| `site` | <code>string</code> | The name of the site to list the plugin data for. |

<a name="creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example_ this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin."></a>

## creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.
**Kind**: global class  
<a name="mongoose"></a>

## mongoose
Created by Deebobo.dev on 25/05/2017.
copyright 2017 Deebobo.dev
See the COPYRIGHT file at the top-level directory of this distribution

**Kind**: global constant  
