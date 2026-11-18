// quiz_screen.dart
// Pantalla de Quiz/Autoevaluación por temática.
// Recibe tematicaId via GoRouter params y muestra las preguntas de evaluación.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'package:dentomax_app/providers/contenido_provider.dart';
import 'package:dentomax_app/providers/progreso_provider.dart';
import 'package:dentomax_app/models/evaluacion_model.dart';
import 'package:dentomax_app/theme/app_theme.dart';

/// Pantalla principal de quiz. Muestra preguntas una a una (o todas si ≤5).
class QuizScreen extends StatefulWidget {
  /// ID de la temática para cargar sus evaluaciones.
  final String tematicaId;

  const QuizScreen({super.key, required this.tematicaId});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  /// Índice de la pregunta actualmente visible.
  int _preguntaActual = 0;

  /// Mapa de respuestas seleccionadas: índice de pregunta → índice de opción.
  final Map<int, int> _respuestasSeleccionadas = {};

  /// Indica si el quiz ya fue enviado.
  bool _enviado = false;

  /// Controla si se muestran todas las preguntas (modo compacto para ≤5).
  bool get _mostrarTodas => _evaluaciones.length <= 5;

  List<Evaluacion> _evaluaciones = [];
  bool _cargando = true;

  @override
  void initState() {
    super.initState();
    // Cargar evaluaciones de la temática al inicializar.
    WidgetsBinding.instance.addPostFrameCallback((_) => _cargarEvaluaciones());
  }

  /// Carga las evaluaciones desde el ContenidoProvider.
  Future<void> _cargarEvaluaciones() async {
    final contenido = context.read<ContenidoProvider>();
    await contenido.seleccionarTematica(widget.tematicaId);
    final tematica = contenido.tematicaActual;
    setState(() {
      _evaluaciones = tematica?.evaluaciones ?? [];
      _cargando = false;
    });
  }

  /// Avanza a la siguiente pregunta o finaliza si es la última.
  void _siguiente() {
    // Validar que haya respuesta seleccionada para la pregunta actual.
    if (!_respuestasSeleccionadas.containsKey(_preguntaActual)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Debes seleccionar una respuesta para continuar.'),
          backgroundColor: Colors.orange,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    if (_preguntaActual < _evaluaciones.length - 1) {
      setState(() => _preguntaActual++);
    } else {
      _finalizar();
    }
  }

  /// Calcula el puntaje, guarda en ProgresoProvider y navega a ResultadoScreen.
  Future<void> _finalizar() async {
    // Validar que todas las preguntas tengan respuesta.
    if (_respuestasSeleccionadas.length < _evaluaciones.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Debes responder todas las preguntas.'),
          backgroundColor: Colors.orange,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    // Calcular puntaje.
    int puntaje = 0;
    for (int i = 0; i < _evaluaciones.length; i++) {
      if (_respuestasSeleccionadas[i] == _evaluaciones[i].respuestaCorrecta) {
        puntaje++;
      }
    }

    // Guardar progreso en el provider.
    await context.read<ProgresoProvider>().guardarResultadoQuiz(
          tematicaId: widget.tematicaId,
          puntaje: puntaje,
          total: _evaluaciones.length,
        );

    setState(() => _enviado = true);

    if (!mounted) return;

    // Navegar a ResultadoScreen con los datos del quiz.
    context.go(
      '/quiz/resultado',
      extra: {
        'puntaje': puntaje,
        'total': _evaluaciones.length,
        'tematicaId': widget.tematicaId,
        'evaluaciones': _evaluaciones,
        'respuestasSeleccionadas': Map<int, int>.from(_respuestasSeleccionadas),
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_cargando) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_evaluaciones.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Evaluación')),
        body: const Center(
          child: Text('No hay preguntas disponibles para esta temática.'),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text('Evaluación'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _mostrarTodas ? _buildTodasLasPreguntas() : _buildPreguntaUnica(),
    );
  }

  /// Modo compacto: muestra todas las preguntas cuando son ≤5.
  Widget _buildTodasLasPreguntas() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Encabezado con total de preguntas.
        _buildEncabezado(),
        const SizedBox(height(16)),
        // Lista de todas las preguntas.
        for (int i = 0; i < _evaluaciones.length; i++) ...[
          _buildTarjetaPregunta(i),
          const SizedBox(height: 16),
        ],
        // Botón finalizar.
        _buildBotonFinalizar(),
        const SizedBox(height: 32),
      ],
    );
  }

  /// Modo paginado: muestra una pregunta a la vez cuando son >5.
  Widget _buildPreguntaUnica() {
    return Column(
      children: [
        // Barra de progreso superior.
        _buildBarraProgreso(),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildTarjetaPregunta(_preguntaActual),
            ],
          ),
        ),
        // Botones de navegación.
        _buildBotonesNavegacion(),
      ],
    );
  }

  /// Encabezado con información del quiz.
  Widget _buildEncabezado() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.primaryColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.quiz, color: AppTheme.primaryColor, size: 28),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Autoevaluación',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                '${_evaluaciones.length} preguntas en total',
                style: const TextStyle(color: Colors.white54, fontSize: 13),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms);
  }

  /// Barra de progreso superior (pregunta X de N).
  Widget _buildBarraProgreso() {
    final progreso = (_preguntaActual + 1) / _evaluaciones.length;
    return Container(
      color: AppTheme.surfaceColor,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Pregunta ${_preguntaActual + 1} de ${_evaluaciones.length}',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              Text(
                '${(_respuestasSeleccionadas.length)} respondidas',
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progreso,
              backgroundColor: Colors.white12,
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  /// Tarjeta de una pregunta con sus opciones de respuesta.
  Widget _buildTarjetaPregunta(int index) {
    final pregunta = _evaluaciones[index];
    final respuestaSeleccionada = _respuestasSeleccionadas[index];

    return Card(
      color: AppTheme.surfaceColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.white12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Número de pregunta + texto.
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                'Pregunta ${index + 1}',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              pregunta.pregunta,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w500,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),
            // Opciones de respuesta como RadioListTile.
            ...List.generate(pregunta.opciones.length, (opcionIndex) {
              final seleccionada = respuestaSeleccionada == opcionIndex;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: seleccionada
                      ? AppTheme.primaryColor.withOpacity(0.15)
                      : Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: seleccionada
                        ? AppTheme.primaryColor.withOpacity(0.6)
                        : Colors.white12,
                    width: seleccionada ? 1.5 : 1,
                  ),
                ),
                child: RadioListTile<int>(
                  value: opcionIndex,
                  groupValue: respuestaSeleccionada,
                  activeColor: AppTheme.primaryColor,
                  title: Text(
                    pregunta.opciones[opcionIndex],
                    style: TextStyle(
                      color: seleccionada ? Colors.white : Colors.white70,
                      fontSize: 15,
                    ),
                  ),
                  onChanged: (val) {
                    setState(() {
                      _respuestasSeleccionadas[index] = val!;
                    });
                  },
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.05, end: 0);
  }

  /// Botones de navegación para modo paginado (Siguiente / Finalizar).
  Widget _buildBotonesNavegacion() {
    final esUltima = _preguntaActual == _evaluaciones.length - 1;
    return Container(
      color: AppTheme.surfaceColor,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (_preguntaActual > 0) ...[
            Expanded(
              child: OutlinedButton(
                onPressed: () => setState(() => _preguntaActual--),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white70,
                  side: const BorderSide(color: Colors.white24),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text('Anterior'),
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            flex: 2,
            child: ElevatedButton(
              onPressed: esUltima ? _finalizar : _siguiente,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                esUltima ? 'Finalizar' : 'Siguiente',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Botón Finalizar para modo con todas las preguntas visibles.
  Widget _buildBotonFinalizar() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _finalizar,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: const Text(
          'Finalizar Evaluación',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
