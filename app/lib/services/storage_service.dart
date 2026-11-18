// Servicio de almacenamiento local para Dentomax.
// Gestiona token de sesión, estado de intro y progreso del alumno
// usando shared_preferences para persistencia en web y móvil.

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Claves de SharedPreferences
const String _kToken = 'dentomax_token';
const String _kIntroPrefix = 'intro_visto_';
const String _kProgresoPrefix = 'progreso_';

/// [StorageService] centraliza la lectura y escritura en SharedPreferences.
class StorageService {
  StorageService._internal();
  static final StorageService instance = StorageService._internal();
  factory StorageService() => instance;

  // ---------------------------------------------------------------------------
  // TOKEN DE SESIÓN
  // ---------------------------------------------------------------------------

  /// Persiste el [token] JWT de la sesión activa.
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kToken, token);
  }

  /// Recupera el token guardado. Devuelve null si no existe.
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_kToken);
  }

  /// Elimina el token (logout).
  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kToken);
  }

  // ---------------------------------------------------------------------------
  // INTRO VISTA
  // ---------------------------------------------------------------------------

  /// Marca que el usuario [userId] ya vio la pantalla de introducción.
  Future<void> saveIntroVisto(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('$_kIntroPrefix$userId', true);
  }

  /// Devuelve true si el usuario [userId] ya vio la intro.
  Future<bool> getIntroVisto(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('$_kIntroPrefix$userId') ?? false;
  }

  // ---------------------------------------------------------------------------
  // PROGRESO POR TEMÁTICA
  // ---------------------------------------------------------------------------

  /// Guarda o actualiza el [puntaje] del quiz de [tematicaId] para [userId].
  /// Almacena una lista de mapas JSON en SharedPreferences.
  Future<void> saveProgreso(
      String userId, String tematicaId, int puntaje) async {
    final prefs = await SharedPreferences.getInstance();
    final key = '$_kProgresoPrefix$userId';

    // Leer lista existente
    final raw = prefs.getString(key);
    final List<Map<String, dynamic>> lista = raw != null
        ? List<Map<String, dynamic>>.from(
            (jsonDecode(raw) as List).map((e) => Map<String, dynamic>.from(e as Map)))
        : [];

    // Actualizar o agregar entrada para esta temática
    final idx = lista.indexWhere((m) => m['tematicaId'] == tematicaId);
    final entrada = {
      'tematicaId': tematicaId,
      'completado': true,
      'puntajeQuiz': puntaje,
      'fechaCompletado': DateTime.now().toIso8601String(),
    };

    if (idx >= 0) {
      lista[idx] = entrada;
    } else {
      lista.add(entrada);
    }

    await prefs.setString(key, jsonEncode(lista));
  }

  /// Devuelve la lista de progresos almacenados para [userId].
  /// Cada elemento tiene: tematicaId, completado, puntajeQuiz, fechaCompletado.
  Future<List<Map<String, dynamic>>> getProgresos(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = '$_kProgresoPrefix$userId';
    final raw = prefs.getString(key);
    if (raw == null) return [];
    return List<Map<String, dynamic>>.from(
        (jsonDecode(raw) as List).map((e) => Map<String, dynamic>.from(e as Map)));
  }
}
