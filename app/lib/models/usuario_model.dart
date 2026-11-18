// lib/models/usuario_model.dart
// Modelo que representa a un usuario autenticado en DentoMax.
// Los roles definen las vistas y permisos disponibles en la app.

/// Roles posibles dentro del sistema educativo DentoMax.
enum Rol {
  /// Estudiante de odontología — acceso a contenido y evaluaciones.
  alumno,

  /// Docente — puede ver progreso de alumnos y gestionar contenido.
  docente,

  /// Administrador institucional — acceso completo al sistema.
  administrador,
}

/// Extiende [Rol] con helpers de serialización desde/hacia JSON.
extension RolExtension on Rol {
  /// Convierte el enum a su representación en cadena para JSON.
  String toJson() => name; // 'alumno' | 'docente' | 'administrador'

  /// Parsea una cadena proveniente del backend al enum correspondiente.
  static Rol fromJson(String value) {
    return Rol.values.firstWhere(
      (r) => r.name == value,
      orElse: () => Rol.alumno,
    );
  }
}

/// Representa a un usuario de la plataforma DentoMax.
class Usuario {
  /// Identificador único (UUID del backend).
  final String id;

  /// Nombre completo del usuario.
  final String nombre;

  /// Correo electrónico institucional (único, usado como login).
  final String email;

  /// Rol que determina los permisos y vistas del usuario.
  final Rol rol;

  const Usuario({
    required this.id,
    required this.nombre,
    required this.email,
    required this.rol,
  });

  // ── Serialización ─────────────────────────────────────────────────────────

  /// Construye un [Usuario] desde el mapa JSON devuelto por la API.
  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      email: json['email'] as String,
      rol: RolExtension.fromJson(json['rol'] as String? ?? 'alumno'),
    );
  }

  /// Convierte el [Usuario] a un mapa JSON para persistencia o peticiones API.
  Map<String, dynamic> toJson() => {
        'id': id,
        'nombre': nombre,
        'email': email,
        'rol': rol.toJson(),
      };

  // ── Utilidades ────────────────────────────────────────────────────────────

  /// Retorna una copia del usuario con los campos modificados indicados.
  Usuario copyWith({
    String? id,
    String? nombre,
    String? email,
    Rol? rol,
  }) {
    return Usuario(
      id: id ?? this.id,
      nombre: nombre ?? this.nombre,
      email: email ?? this.email,
      rol: rol ?? this.rol,
    );
  }

  @override
  String toString() => 'Usuario(id: $id, nombre: $nombre, email: $email, rol: $rol)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Usuario && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
