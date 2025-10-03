<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateUserPasswordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Actualizar la contraseña del usuario 'jose' con hash
        \App\Models\Usuario::where('usuario', 'jose')
            ->update([
                'contraseña' => \Illuminate\Support\Facades\Hash::make('123456')
            ]);
        
        $this->command->info('Contraseña del usuario jose actualizada con hash');
    }
}
