<?php

namespace App\Enums;

enum UserOccupasion: string

{
    case STUDENT = 'student'; // pelajar / mahasiswa
    case WORKER  = 'worker';  // sudah bekerja / profesional

    /**
     * Label manusiawi (untuk tampilan UI).
     */
    public function label(): string
    {
        return match($this) {
            self::STUDENT => 'Pelajar / Mahasiswa',
            self::WORKER => 'Pekerja / Profesional',
        };
    }

    /**
     * Warna Tailwind untuk badge atau label.
     */
    public function colorClass(): string
    {
        return match($this) {
            self::STUDENT => 'bg-blue-100 text-blue-800',
            self::WORKER  => 'bg-amber-100 text-amber-800',
        };
    }

    /**
     * Semua nilai enum sebagai array string (mis. untuk validasi).
     */
    public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
