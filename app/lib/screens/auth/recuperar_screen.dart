// Pantalla de recuperación de contraseña para DentoMAX.
// Comportamiento mock: siempre muestra éxito tras 1 segundo de espera.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// ---------------------------------------------------------------------------
// Colores del tema oscuro
// ---------------------------------------------------------------------------
const Color _kBackground  = Color(0xFF0A0A0A);
const Color _kSurface     = Color(0xFF141414);
const Color _kInputBg     = Color(0xFF1E1E1E);
const Color _kInputBorder = Color(0xFF2A2A2A);
const Color _kPrimary     = Color(0xFFC41E3A);
const Color _kTextMuted   = Color(0xFF888888);
const Color _kSuccess     = Color(0xFF4CAF50);

class RecuperarScreen extends StatefulWidget {
  const RecuperarScreen({super.key});

  @override
  State<RecuperarScreen> createState() => _RecuperarScreenState();
}

class _RecuperarScreenState extends State<RecuperarScreen> {
  final _formKey  = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();

  // Estado de la pantalla
  bool _isLoading  = false; // mientras espera la respuesta simulada
  bool _emailSent  = false; // true cuando el mock devuelve éxito

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  // -------------------------------------------------------------------------
  // Acción: enviar instrucciones (mock — siempre éxito tras 1 segundo)
  // -------------------------------------------------------------------------
  Future<void> _handleEnviar() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    // Simular latencia de red
    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _isLoading = false;
        _emailSent = true; // pantalla de confirmación
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBackground,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: ConstrainedBox(
            // Ancho máximo 420px — layout web centrado
            constraints: const BoxConstraints(maxWidth: 420),
            child: Card(
              color: _kSurface,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: _kInputBorder),
              ),
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: _emailSent
                    ? _buildSuccessView(context)
                    : _buildFormView(context),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // Vista del formulario de ingreso de email
  // -------------------------------------------------------------------------
  Widget _buildFormView(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Branding DentoMAX
        const Text(
          'DentoMAX',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: _kPrimary,
            letterSpacing: 1.2,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Recuperar contraseña',
          style: TextStyle(color: _kTextMuted, fontSize: 14),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.',
          style: TextStyle(color: _kTextMuted, fontSize: 12),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 28),

        // Formulario con campo email
        Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Campo email
              TextFormField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                enabled: !_isLoading,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                validator: (v) {
                  if (v == null || v.isEmpty) {
                    return 'Ingresa tu correo';
                  }
                  final emailRegex =
                      RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                  if (!emailRegex.hasMatch(v.trim())) {
                    return 'Correo inválido';
                  }
                  return null;
                },
                decoration: InputDecoration(
                  labelText: 'Correo electrónico',
                  hintText: 'ejemplo@utalca.cl',
                  labelStyle:
                      const TextStyle(color: _kTextMuted, fontSize: 13),
                  hintStyle:
                      const TextStyle(color: _kInputBorder, fontSize: 13),
                  filled: true,
                  fillColor: _kInputBg,
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: _kInputBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: _kInputBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        const BorderSide(color: _kPrimary, width: 1.5),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: _kPrimary),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        const BorderSide(color: _kPrimary, width: 1.5),
                  ),
                  errorStyle:
                      const TextStyle(color: _kPrimary, fontSize: 12),
                ),
              ),
              const SizedBox(height: 24),

              // Botón "Enviar instrucciones" o indicador de carga
              _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        color: _kPrimary,
                        strokeWidth: 2,
                      ),
                    )
                  : ElevatedButton(
                      onPressed: _handleEnviar,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        minimumSize: const Size(double.infinity, 48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Enviar instrucciones',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
              const SizedBox(height: 20),

              // Link para volver al login
              Center(
                child: GestureDetector(
                  onTap: _isLoading ? null : () => context.go('/login'),
                  child: const Text(
                    '← Volver al inicio de sesión',
                    style: TextStyle(
                      color: _kTextMuted,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // -------------------------------------------------------------------------
  // Vista de éxito: se muestra tras el mock exitoso
  // -------------------------------------------------------------------------
  Widget _buildSuccessView(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Ícono de confirmación
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: _kSuccess.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.mark_email_read_outlined,
            color: _kSuccess,
            size: 32,
          ),
        ),
        const SizedBox(height: 20),

        // Título confirmación
        const Text(
          '¡Correo enviado!',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),

        // Descripción con el email ingresado
        Text(
          'Si ${_emailCtrl.text.trim()} está registrado, '
          'recibirás un correo con instrucciones para restablecer tu contraseña.',
          style: TextStyle(color: _kTextMuted, fontSize: 13, height: 1.5),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 28),

        // Botón volver al login
        ElevatedButton(
          onPressed: () => context.go('/login'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            minimumSize: const Size(double.infinity, 48),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            elevation: 0,
          ),
          child: const Text(
            'Volver al inicio de sesión',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
        ),
      ],
    );
  }
}
