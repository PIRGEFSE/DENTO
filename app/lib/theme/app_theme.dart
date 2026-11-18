// lib/theme/app_theme.dart
// Definición del tema visual global de DentoMax.
// Paleta oscura inspirada en entornos de diagnóstico radiográfico (fondos neutros,
// acento rojo institucional Universidad de Talca).

import 'package:flutter/material.dart';

class AppTheme {
  // ── Colores base ──────────────────────────────────────────────────────────
  /// Fondo principal de la aplicación (negro profundo)
  static const Color fondoPrincipal = Color(0xFF0A0A0A);

  /// Superficie de tarjetas, diálogos y paneles
  static const Color superficie = Color(0xFF141414);

  /// Color primario institucional (rojo UTalca)
  static const Color primario = Color(0xFFC41E3A);

  /// Variante más clara del primario para estados hover/foco
  static const Color primarioClaro = Color(0xFFE53955);

  /// Color para bordes e inputs
  static const Color borde = Color(0xFF2A2A2A);

  /// Fondo de inputs
  static const Color fondoInput = Color(0xFF1E1E1E);

  /// Texto principal (blanco suave)
  static const Color textoPrincipal = Color(0xFFEEEEEE);

  /// Texto secundario / subtítulos
  static const Color textoSecundario = Color(0xFF9E9E9E);

  /// Color de éxito (verde)
  static const Color exito = Color(0xFF4CAF50);

  /// Color de advertencia
  static const Color advertencia = Color(0xFFFFC107);

  /// Color de error
  static const Color error = Color(0xFFEF5350);

  // ── ThemeData completo ────────────────────────────────────────────────────
  /// Devuelve el [ThemeData] oscuro configurado para DentoMax.
  static ThemeData get dark {
    final base = ThemeData.dark();

    return base.copyWith(
      useMaterial3: true,

      // Esquema de colores
      colorScheme: const ColorScheme.dark(
        primary: primario,
        onPrimary: Colors.white,
        primaryContainer: Color(0xFF7B0020),
        onPrimaryContainer: Color(0xFFFFDAD9),
        secondary: Color(0xFF9E9E9E),
        onSecondary: Colors.black,
        surface: superficie,
        onSurface: textoPrincipal,
        error: error,
        onError: Colors.white,
        outline: borde,
      ),

      // Fondo del Scaffold
      scaffoldBackgroundColor: fondoPrincipal,

      // AppBar oscura sin sombra
      appBarTheme: const AppBarTheme(
        backgroundColor: superficie,
        foregroundColor: textoPrincipal,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: textoPrincipal,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
        iconTheme: IconThemeData(color: textoPrincipal),
      ),

      // Cards / paneles
      cardTheme: CardTheme(
        color: superficie,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: borde, width: 0.5),
        ),
        margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 0),
      ),

      // Botón principal (ElevatedButton)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primario,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
          elevation: 0,
        ),
      ),

      // Botón de texto (TextButton)
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primario,
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ),

      // Botón outline (OutlinedButton)
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: textoPrincipal,
          side: const BorderSide(color: borde),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),

      // Campos de texto
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: fondoInput,
        hintStyle: const TextStyle(color: textoSecundario, fontSize: 14),
        labelStyle: const TextStyle(color: textoSecundario, fontSize: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: borde),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: borde),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primario, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: error, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),

      // BottomNavigationBar
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: superficie,
        selectedItemColor: primario,
        unselectedItemColor: textoSecundario,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),

      // Chips (filtros, categorías)
      chipTheme: ChipThemeData(
        backgroundColor: fondoInput,
        labelStyle: const TextStyle(color: textoPrincipal, fontSize: 13),
        side: const BorderSide(color: borde),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),

      // Dividers
      dividerTheme: const DividerThemeData(
        color: borde,
        thickness: 0.5,
      ),

      // SnackBar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: superficie,
        contentTextStyle: const TextStyle(color: textoPrincipal),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),

      // Tipografía
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w700),
        displayMedium: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w600),
        headlineLarge: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w700),
        headlineMedium: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w600),
        headlineSmall: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w500),
        titleLarge: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w600),
        titleMedium: TextStyle(color: textoPrincipal),
        titleSmall: TextStyle(color: textoSecundario),
        bodyLarge: TextStyle(color: textoPrincipal, fontSize: 16),
        bodyMedium: TextStyle(color: textoPrincipal, fontSize: 14),
        bodySmall: TextStyle(color: textoSecundario, fontSize: 12),
        labelLarge: TextStyle(color: textoPrincipal, fontWeight: FontWeight.w500),
        labelMedium: TextStyle(color: textoSecundario),
        labelSmall: TextStyle(color: textoSecundario, fontSize: 11),
      ),
    );
  }
}
