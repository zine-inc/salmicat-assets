# zine-assets

ZINE's static resources.

[![wercker status](https://app.wercker.com/status/dec864bb03b1f0cc813aa6008fd607bb/m "wercker status")](https://app.wercker.com/project/bykey/dec864bb03b1f0cc813aa6008fd607bb)

## Getting started

### Website

```html
<link rel="stylesheet" href="//cdn.salmicat.com/assets/vendor/off-screen-nav.css">
<link rel="stylesheet" href="//cdn.salmicat.com/assets/css/wp.css">
<link rel="stylesheet" href="//cdn.salmicat.com/assets/css/wp-article.css">
```

```html
<script src='//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js'></script>
<script src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>
<script src="//cdn.salmicat.com/assets/vendor/woothee.js"></script>
<script src="//cdn.salmicat.com/assets/js/social.js"></script>
<script src="//cdn.salmicat.com/assets/js/wp.js"></script>
```

### WordPress

```php
add_action('wp_enqueue_scripts', 'load_styles_and_scripts');
function load_styles_and_scripts() {
    if (is_admin()) {
        // do nothing
    } else {
        // Load from head
        wp_enqueue_style('bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
        wp_enqueue_style('font-awesome', '//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css');
        wp_enqueue_style('effeckt', '//cdn.salmicat.com/assets/vendor/off-screen-nav.css');
        wp_enqueue_style('salmicons', '//cdn.salmicat.com/salmicons/salmicons.css');
        wp_enqueue_style('zine-style', '//cdn.salmicat.com/assets/css/wp.css');
        wp_enqueue_style('main', SITE_ASSETS_URL . 'main.css', array('bootstrap', 'font-awesome','effeckt', 'salmicons', 'zine-style'), '0.0.1');
        if (is_single()) wp_enqueue_style('article', '//cdn.salmicat.com/assets/css/wp-article.css');

        // jQuery
        wp_deregister_script('jquery');
        wp_enqueue_script('jquery', '//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js', array(), null, true);

        // Load from body footer
        wp_register_script('bootstrap-script', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js', array('jquery'), null, true);
        wp_register_script('fastclick', '//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', array(), null, true);
        wp_register_script('woothee', '//cdn.salmicat.com/assets/vendor/woothee.js', array(), null, true);
        wp_enqueue_script('zine-script', '//cdn.salmicat.com/assets/js/wp.js', array('jquery', 'woothee', 'fastclick'), null, true);
        wp_enqueue_script('social', '//cdn.salmicat.com/assets/js/social.js', array('jquery'), null, true);
        wp_enqueue_script('main', SITE_ASSETS_URL . 'main.js', array('woothee', 'jquery', 'bootstrap-script'), '0.0.1', true);
    }
}
```

## Examples
