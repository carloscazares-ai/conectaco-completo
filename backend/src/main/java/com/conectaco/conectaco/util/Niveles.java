package com.conectaco.conectaco.util;

// Reglas de niveles: cada 500 XP se sube un nivel (empezando en el nivel 1).
public final class Niveles {

    public static final int XP_POR_NIVEL = 500;

    private Niveles() {
    }

    public static int nivel(int xp) {
        return xp / XP_POR_NIVEL + 1;
    }

    public static int xpEnNivel(int xp) {
        return xp % XP_POR_NIVEL;
    }
}
