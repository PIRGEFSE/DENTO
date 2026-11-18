// Provider de autenticación para Dentomax.
// Gestiona el estado de sesión (login, registro, logout) usando
// ApiService para autenticar y StorageService para persistir el token.

import 'package:flutter/foundation.dart';
import 'package:dentomax_app/models/models.dart';
import 'package:dentomax_app/services/api_service.dart';
import 'package:dentomax_app/services/storage_service.dart';

/// [AuthProvider] maneja el estado global de autenticación de la app.
/// Debe ser provisto en la raíz del widget tree con [ChangeNotifierProvider].
class AuthProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  final StorageService _storage = StorageService();

  // ---------------------------------------------------------------------------
  // ESTADO
  // ---------------------------------------------------------------------------

  /// Usuario actualmente autenticado. null si no hay sesión.
  Usuario? usuario;

  /// true mientras se ejecuta una operación de red (login/register).
  bool isLoading = false;

  /// Mensaje de error del último intento. null si no hay error.
  String? error;

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  /// true si hay un usuario autenticado.
  bool get isAuthenticated => usuario != null;

  // ---------------------------------------------------------------------------
  // MÉTODOS PÚBLICOS
  // ---------------------------------------------------------------------------

  /// Intenta iniciar sesión con [email] y [password].
  /// Si tiene éxito, persiste el token y actualiza [usuario].
  /// Lanza/setea [error] si falla.
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _setError(null);

    try {
      final data = await _api.login(email, password);

      // Persistir token
      final token = data['token'] as String;
      await _storage.saveToken(token);

      // Construir modelo de usuario
      final usuarioData = data['usuario'] as Map<String, dynamic>;
      usuario = Usuario.fromJson(usuarioData);

      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(_mensajeError(e));
      _setLoading(false);
      return false;
    }
  }

  /// Registra un nuevo usuario con [nombre], [email] y [password].
  /// Si tiene éxito, inicia sesión automáticamente.
  Future<bool> register(String nombre, String email, String password) async {
    _setLoading(true);
    _setError(null);

    try {
      final data = await _api.register(nombre, email, password);

      final token = data['token'] as String;
      await _storage.saveToken(token);

      final usuarioData = data['usuario'] as Map<String, dynamic>;
      usuario = Usuario.fromJson(usuarioData);

      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(_mensajeError(e));
      _setLoading(false);
      return false;
    }
  }

  /// Cierra la sesión: limpia token, usuario y notifica a los listeners.
  Future<void> logout() async {
    await _storage.clearToken();
    usuario = null;
    error = null;
    notifyListeners();
  }

  /// Intenta restaurar la sesión desde el token guardado.
  /// Llamar al iniciar la app (en main o en el splash).
  Future<void> tryRestoreSession() async {
    final token = await _storage.getToken();
    if (token == null) return;

    // Con token mock reconstruimos usuario desde storage si lo hubiera;
    // en producción haríamos GET /api/auth/me con el token.
    // Por ahora no hay endpoint /me: dejamos sesión sin restaurar silenciosamente.
  }

  // ---------------------------------------------------------------------------
  // HELPERS PRIVADOS
  // ---------------------------------------------------------------------------

  void _setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  void _setError(String? value) {
    error = value;
  }

  /// Convierte excepciones en mensajes legibles para el usuario.
  String _mensajeError(Object e) {
    final msg = e.toString();
    if (msg.contains('Credenciales')) return 'Email o contraseña incorrectos.';
    if (msg.contains('SocketException') || msg.contains('timeout')) {
      return 'Sin conexión al servidor. Verifica tu red.';
    }
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
