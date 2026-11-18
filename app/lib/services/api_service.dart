// Servicio principal de API para Dentomax.
// Conecta con el CMS Next.js en localhost:3001.
// Mientras el backend usa mock data, los métodos _mock* proveen datos de demostración.

import 'dart:convert';
import 'package:http/http.dart' as http;

/// URL base del CMS Next.js
const String _kBaseUrl = 'http://localhost:3001/api';

/// [ApiService] es un singleton que centraliza todas las llamadas HTTP.
class ApiService {
  ApiService._internal();
  static final ApiService instance = ApiService._internal();
  factory ApiService() => instance;

  final String baseUrl = _kBaseUrl;

  /// Cabeceras JSON por defecto
  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // ---------------------------------------------------------------------------
  // AUTH
  // ---------------------------------------------------------------------------

  /// Inicia sesión con [email] y [password].
  /// Devuelve un Map con al menos las claves 'token' y 'usuario'.
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      // Intentar llamada real al CMS
      final uri = Uri.parse('$baseUrl/auth/login');
      final response = await http
          .post(
            uri,
            headers: _headers,
            body: jsonEncode({'email': email, 'password': password}),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      // Si el servidor responde con error, caer en mock
      return _mockLogin(email, password);
    } catch (_) {
      // Sin conexión → usar datos mock
      return _mockLogin(email, password);
    }
  }

  /// Registra un nuevo usuario.
  Future<Map<String, dynamic>> register(
      String nombre, String email, String password) async {
    try {
      final uri = Uri.parse('$baseUrl/auth/register');
      final response = await http
          .post(
            uri,
            headers: _headers,
            body: jsonEncode(
                {'nombre': nombre, 'email': email, 'password': password}),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 201 || response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      throw Exception('Error al registrar: ${response.statusCode}');
    } catch (e) {
      // Mock: registro siempre exitoso para pruebas
      return {
        'token': 'mock-token-nuevo-${DateTime.now().millisecondsSinceEpoch}',
        'usuario': {
          'id': 'u-${DateTime.now().millisecondsSinceEpoch}',
          'nombre': nombre,
          'email': email,
          'rol': 'alumno',
        },
      };
    }
  }

  // ---------------------------------------------------------------------------
  // CONTENIDO
  // ---------------------------------------------------------------------------

  /// Obtiene la lista de temáticas disponibles.
  Future<List<Map<String, dynamic>>> getTematicas() async {
    try {
      final uri = Uri.parse('$baseUrl/tematicas');
      final response = await http
          .get(uri, headers: _headers)
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data as List);
      }
      return _mockTematicas();
    } catch (_) {
      return _mockTematicas();
    }
  }

  /// Obtiene el detalle de una radiografía por [id].
  Future<Map<String, dynamic>> getRadiografia(String id) async {
    try {
      final uri = Uri.parse('$baseUrl/radiografias/$id');
      final response = await http
          .get(uri, headers: _headers)
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      // Buscar en mock
      return _mockRadiografiaById(id);
    } catch (_) {
      return _mockRadiografiaById(id);
    }
  }

  /// Obtiene la lista de ítems multimedia.
  Future<List<Map<String, dynamic>>> getMultimedia() async {
    try {
      final uri = Uri.parse('$baseUrl/multimedia');
      final response = await http
          .get(uri, headers: _headers)
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data as List);
      }
      return _mockMultimedia();
    } catch (_) {
      return _mockMultimedia();
    }
  }

  // ---------------------------------------------------------------------------
  // DATOS MOCK
  // ---------------------------------------------------------------------------

  /// Login mock. Acepta alumno@utalca.cl/alumno123 y docente@utalca.cl/docente123.
  Map<String, dynamic> _mockLogin(String email, String password) {
    final usuarios = {
      'alumno@utalca.cl': {
        'password': 'alumno123',
        'usuario': {
          'id': 'u-001',
          'nombre': 'Alumno Demo',
          'email': 'alumno@utalca.cl',
          'rol': 'alumno',
        },
      },
      'docente@utalca.cl': {
        'password': 'docente123',
        'usuario': {
          'id': 'u-002',
          'nombre': 'Docente Demo',
          'email': 'docente@utalca.cl',
          'rol': 'docente',
        },
      },
    };

    final entry = usuarios[email];
    if (entry != null && entry['password'] == password) {
      return {
        'token': 'mock-token-${email.hashCode}',
        'usuario': entry['usuario'],
      };
    }
    throw Exception('Credenciales incorrectas');
  }

  /// 3 temáticas mock de anatomía dental con 2 radiografías cada una.
  List<Map<String, dynamic>> _mockTematicas() {
    return [
      {
        'id': 't-001',
        'nombre': 'Anatomía General Cabeza y Cuello',
        'descripcionBreve':
            'Estructuras óseas, musculares y nerviosas de la región maxilofacial.',
        'ordenAparicion': 1,
        'tituloBloque': 'Fundamentos Anatómicos',
        'contenidoEducativo':
            'El cráneo humano está compuesto por 22 huesos divididos en neurocrá­neo y viscerocráneo. '
                'En esta temática exploramos los reparos anatómicos visibles en radiografías convencionales.',
        'radiografias': [_mockRadiografia('r-001', 't-001'), _mockRadiografia('r-002', 't-001')],
        'evaluaciones': [_mockEvaluacion('e-001', 't-001')],
      },
      {
        'id': 't-002',
        'nombre': 'Técnica Periapical',
        'descripcionBreve':
            'Técnica radiográfica intraoral para visualizar ápices dentarios.',
        'ordenAparicion': 2,
        'tituloBloque': 'Radiografía Periapical',
        'contenidoEducativo':
            'La técnica periapical permite visualizar la totalidad del diente, '
                'incluyendo corona, raíz y estructuras de soporte óseo periapical.',
        'radiografias': [_mockRadiografia('r-003', 't-002'), _mockRadiografia('r-004', 't-002')],
        'evaluaciones': [_mockEvaluacion('e-002', 't-002')],
      },
      {
        'id': 't-003',
        'nombre': 'Panorámica Completa',
        'descripcionBreve':
            'Radiografía panorámica (OPG) que muestra ambos maxilares.',
        'ordenAparicion': 3,
        'tituloBloque': 'Ortopantomografía',
        'contenidoEducativo':
            'La ortopantomografía es una radiografía extraoral que captura ambos maxilares, '
                'la dentición completa, articulaciones temporomandibulares y senos maxilares.',
        'radiografias': [_mockRadiografia('r-005', 't-003'), _mockRadiografia('r-006', 't-003')],
        'evaluaciones': [_mockEvaluacion('e-003', 't-003')],
      },
    ];
  }

  /// Genera una radiografía mock con 3 hotspots.
  Map<String, dynamic> _mockRadiografia(String id, String tematicaId) {
    final tiposPorId = {
      'r-001': 'panoramica',
      'r-002': 'periapical',
      'r-003': 'periapical',
      'r-004': 'periapical',
      'r-005': 'panoramica',
      'r-006': 'telerradiografia',
    };
    return {
      'id': id,
      'tematicaId': tematicaId,
      'titulo': 'Radiografía ${id.toUpperCase()}',
      'url': 'https://placehold.co/800x600/1a1a1a/C41E3A?text=Radiografia+$id',
      'tipo': tiposPorId[id] ?? 'periapical',
      'hotspots': [
        {
          'id': '${id}-h1',
          'x': 25.0,
          'y': 30.0,
          'etiqueta': 'Cóndilo mandibular',
          'descripcion': 'Cabeza articular de la mandíbula que forma la ATM.',
          'color': '#C41E3A',
        },
        {
          'id': '${id}-h2',
          'x': 50.0,
          'y': 55.0,
          'etiqueta': 'Seno maxilar',
          'descripcion': 'Cavidad neumática del maxilar superior, el mayor de los senos paranasales.',
          'color': '#FF6B35',
        },
        {
          'id': '${id}-h3',
          'x': 75.0,
          'y': 40.0,
          'etiqueta': 'Cresta alveolar',
          'descripcion': 'Borde óseo que sostiene los alvéolos dentarios.',
          'color': '#4CAF50',
        },
      ],
    };
  }

  /// Busca radiografía mock por id.
  Map<String, dynamic> _mockRadiografiaById(String id) {
    final tematicaId = int.tryParse(id.replaceAll(RegExp(r'[^0-9]'), '')) != null
        ? 't-00${((int.parse(id.replaceAll(RegExp(r'[^0-9]'), '')) - 1) ~/ 2) + 1}'
        : 't-001';
    return _mockRadiografia(id, tematicaId);
  }

  /// Evaluación mock.
  Map<String, dynamic> _mockEvaluacion(String id, String tematicaId) {
    return {
      'id': id,
      'tematicaId': tematicaId,
      'pregunta': '¿Cuál estructura corresponde al cóndilo mandibular en la radiografía?',
      'opciones': [
        'La apófisis estiloides',
        'La cabeza articular de la mandíbula',
        'El hueso hioides',
        'El arco cigomático',
      ],
      'respuestaCorrecta': 1,
    };
  }

  /// 2 ítems multimedia mock.
  List<Map<String, dynamic>> _mockMultimedia() {
    return [
      {
        'id': 'm-001',
        'titulo': 'Introducción a la Radiología Dental',
        'tipo': 'video',
        'url': 'https://www.youtube.com/embed/example1',
        'descripcion': 'Video introductorio sobre los principios de radiología dental diagnóstica.',
        'duracion': '12:34',
        'tematicaId': 't-001',
      },
      {
        'id': 'm-002',
        'titulo': 'Atlas Radiográfico Interactivo',
        'tipo': 'documento',
        'url': 'https://placehold.co/pdf-atlas',
        'descripcion': 'Colección de radiografías anotadas con los principales reparos anatómicos.',
        'paginas': 48,
        'tematicaId': 't-002',
      },
    ];
  }
}
