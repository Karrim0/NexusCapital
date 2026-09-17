<?php

namespace App\Support;

class ContentMerge
{
    /**
     * Recursively merge $incoming over $default, but with one crucial
     * difference from PHP's array_replace_recursive: when a value is a
     * "list" array (sequential 0..n keys — e.g. quick_links, destination
     * items, FAQ items, service cards), the incoming list REPLACES the
     * default list wholesale instead of being merged index-by-index.
     *
     * Why this matters: with array_replace_recursive, if an admin deletes
     * an item from a dashboard list (making it shorter than the default
     * list), the leftover default items at the now-unmatched indices
     * silently reappear on every save/load — e.g. deleting "Blog" from
     * Quick Links but it keeps coming back. Treating lists as atomic
     * values fixes that: whatever the admin saved is exactly what's shown.
     *
     * Associative ("map") arrays are still merged key-by-key, recursively,
     * so partial/older saved records still get any newly-added default
     * keys filled in automatically.
     */
    public static function merge($default, $incoming)
    {
        if (!is_array($incoming)) {
            return $incoming;
        }
        if (!is_array($default)) {
            return $incoming;
        }

        // Sequential list array -> replace wholesale, don't merge with default.
        if (array_is_list($incoming)) {
            return $incoming;
        }

        // Associative array -> merge key by key, recursing into sub-arrays.
        $result = $default;
        foreach ($incoming as $key => $value) {
            if (array_key_exists($key, $result) && is_array($result[$key]) && is_array($value)) {
                $result[$key] = self::merge($result[$key], $value);
            } else {
                $result[$key] = $value;
            }
        }
        return $result;
    }

    /**
     * Convenience for the common 3-argument case used across the
     * *ContentController@update methods: merge($default, $current, $incoming).
     * Equivalent to merge(merge($default, $current), $incoming).
     */
    public static function merge3($default, $current, $incoming)
    {
        return self::merge(self::merge($default, $current), $incoming);
    }
}
