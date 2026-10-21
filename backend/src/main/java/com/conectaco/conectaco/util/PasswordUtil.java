package com.conectaco.conectaco.util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

// Guarda las contrasenas cifradas (PBKDF2) en lugar de texto plano.
// Formato guardado en la BD: pbkdf2$iteraciones$sal$hash
public final class PasswordUtil {

    private static final int ITERACIONES = 120_000;
    private static final int LONGITUD_BITS = 256;
    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordUtil() {
    }

    public static String cifrar(String password) {
        byte[] sal = new byte[16];
        RANDOM.nextBytes(sal);
        byte[] hash = pbkdf2(password, sal, ITERACIONES);
        Base64.Encoder b64 = Base64.getEncoder();
        return "pbkdf2$" + ITERACIONES + "$" + b64.encodeToString(sal) + "$" + b64.encodeToString(hash);
    }

    public static boolean coincide(String password, String guardado) {
        if (password == null || guardado == null) {
            return false;
        }
        String[] partes = guardado.split("\\$");
        if (partes.length != 4 || !partes[0].equals("pbkdf2")) {
            return false;
        }
        Base64.Decoder b64 = Base64.getDecoder();
        byte[] sal = b64.decode(partes[2]);
        byte[] esperado = b64.decode(partes[3]);
        byte[] calculado = pbkdf2(password, sal, Integer.parseInt(partes[1]));
        return MessageDigest.isEqual(esperado, calculado);
    }

    private static byte[] pbkdf2(String password, byte[] sal, int iteraciones) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), sal, iteraciones, LONGITUD_BITS);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo cifrar la contrasena", e);
        }
    }
}
