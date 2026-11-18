// lib/models/radiografia_model.dart
// Modelo de una imagen radiográfica con sus hotspots interactivos.
// Cada radiografía pertenece a una temática y tiene un tipo que condiciona
// el modo de visualización (periapical, panorámica, etc.).

import 'hotspot_model.dart';

/// Clasificación técnica de la imagen radiográfica.
enum TipoRadiografia {
  /// Radiografía periapical (un diente y su periápice).
  periapical,

  /// Radiografía panorámica (arco dentario completo).
  panoramica,

  /// Telerradiografía lateral de cráneo (análisis cefalométrico).
  telerradiografia,

  /// Radiografía oclusal (plano horizontal).
  oclusal,
}

/// Extiende [TipoRadiografia] con helpers de serialización.
extension TipoRadiografiaExtension on TipoRadiografia {
  String toJson() => name;

  static TipoRadiografia fromJson(String value) {
    return TipoRadiografia.values.firstWhere(
      (t) => t.name == value,
      orElse: () => TipoRadiografia.periapical,
    );
  }

  /// Etiqueta legible para mostrar en la UI.
  String get etiqueta {
    switch (this) {
      case TipoRadiografia.periapical:
        return 'Periapical';
      case TipoRadiografia.panoramica:
        return 'Panorámica';
      case TipoRadiografia.telerradiografia:
        return 'Telerradiografía';
      case TipoRadiografia.oclusal:
        return 'Oclusal';
    }
  }
}

/// Imagen radiográfica con anotaciones interactivas (hotspots).
class Radiografia {
  /// Identificador único.
  final String id;

  /// Referencia a la temática a la que pertenece esta radiografía.
  final String tematicaId;

  /// Título descriptivo de la imagen (p. ej. "Molar inferior — vista periapical").
  final String titulo;

  /// URL absoluta de la imagen (almacenada en el CMS o CDN).
  final String url;

  /// Tipo técnico de radiografía.
  final TipoRadiografia tipo;

  /// Lista de puntos de interés anotados sobre la imagen.
  final List<Hotspot> hotspots;

  const Radiografia({
    required this.id,
    required this.tematicaId,
    required this.titulo,
    required this.url,
    required this.tipo,
    this.hotspots = const [],
  });

  // ── Serialización ─────────────────────────────────────────────────────────

  /// Construye una [Radiografia] desde el mapa JSON devuelto por la API/CMS.
  factory Radiografia.fromJson(Map<String, dynamic> json) {
    return Radiografia(
      id: json['id'] as String,
      tematicaId: json['tematicaId'] as String,
      titulo: json['titulo'] as String,
      url: json['url'] as String,
      tipo: TipoRadiografiaExtension.fromJson(
        json['tipo'] as String? ?? 'periapical',
      ),
      hotspots: (json['hotspots'] as List<dynamic>? ?? [])
          .map((h) => Hotspot.fromJson(h as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Convierte la [Radiografia] a un mapa JSON compatible con la API/CMS.
  Map<String, dynamic> toJson() => {
        'id': id,
        'tematicaId': tematicaId,
        'titulo': titulo,
        'url': url,
        'tipo': tipo.toJson(),
        'hotspots': hotspots.map((h) => h.toJson()).toList(),
      };

  @override
  String toString() => 'Radiografia(id: $id, titulo: $titulo, tipo: $tipo)';
}
