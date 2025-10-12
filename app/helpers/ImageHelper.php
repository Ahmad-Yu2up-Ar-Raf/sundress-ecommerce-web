<?php

namespace App\Helpers;

use Illuminate\Support\Str;


class ImageHelper
{
    /**
     * Ambil image random dari Picsum
     *
     * @param int $width
     * @param int $height
     * @return string
     */
    public static function random(int $width = 700, int $height = 800): string
    {
        // buat seed unik biar tiap data beda
        $seed = Str::uuid();

        // kembalikan URL dinamis sesuai width & height
        return "https://picsum.photos/seed/{$seed}/{$width}/{$height}/";
    }
}
