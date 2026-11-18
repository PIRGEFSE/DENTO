// lib/models/evaluacion_model.dart
// Modelo de una pregunta de evaluación (quiz) asociada a una temática.
// Cada evaluación tiene opciones de respuesta múltiple y un índice que
// indica cuál es la correcta.

/// Pregunta de selección múltiple para evaluar el aprendizaje del alumno.
class Evaluacion {
  /// Identificador único de la pregunta.
  final String id;

  /// Referencia a la temática a la que pertenece esta evaluación.
  final String tematicaId;

  /// Enunciado de la pregunta.
  final String pregunta;

  /// Lista de opciones de respuesta (mínimo 2, generalmente 4).
  final List<String> opciones;

  /// Índice (base 0) de la opción correcta en [opciones].
  final int respuestaCorrecta;

  const Evaluacion({
    required this.id,
    required this.tematicaId,
    required this.pregunta,
    required this.opciones,
    required this.respuestaCorrecta,
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Verifica si la opción seleccionada por el alumno es correcta.
  bool esCorrecta(int indiceSeleccionado) => indiceSeleccionado == respuestaCorrecta;

  /// Texto de la respuesta correcta.
  String get textoRespuestaCorrecta => opciones[respuestaCorrecta];

  // ── Serialización ─────────────────────────────────────────────────────────

  /// Construye una [Evaluacion] desde el mapa JSON devuelto por la API/CMS.
  factory Evaluacion.fromJson(Map<String, dynamic> json) {
    return Evaluacion(
      id: json['id'] as String,
      tematicaId: json['tematicaId'] as String,
      pregunta: json['pregunta'] as String,
      opciones: List<String>.from(json['opciones'] as List<dynamic>),
      respuestaCorrecta: json['respuestaCorrecta'] as int,
    );
  }

  /// Convierte la [Evaluacion] a un mapa JSON compatible con la API/CMS.
  Map<String, dynamic> toJson() => {
        'id': id,
        'tematicaId': tematicaId,
        'pregunta': pregunta,
        'opciones': opciones,
        'respuestaCorrecta': respuestaCorrecta,
      };

  @override
  String toString() => 'Evaluacion(id: $id, pregunta: $pregunta)';
}
