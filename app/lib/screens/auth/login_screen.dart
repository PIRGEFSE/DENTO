// Pantalla de inicio de sesión de DentoMAX.
// Estilo oscuro minimalista, adaptativa web con ancho máximo 420px.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:dentomax_app/providers/auth_provider.dart';

// ---------------------------------------------------------------------------
// Colores del tema oscuro
// ---------------------------------------------------------------------------
const Color _kBackground  = Color(0xFF0A0A0A);
const Color _kSurface     = Color(0xFF141414);
const Color _kInputBg     = Color(0xFF1E1E1E);
const Color _kInputBorder = Color(0xFF2A2A2A);
const Color _kPrimary     = Color(0xFFC41E3A); // rojo universitario
const Color _kTextMuted   = Color(0xFF888888);

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Clave global para validar el formulario
  final _formKey = GlobalKey<FormState>();

  // Controladores de los campos
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();

  // Estado de visibilidad de la contraseña
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  // -------------------------------------------------------------------------
  // Acción: iniciar sesión
  // -------------------------------------------------------------------------
  Future<void> _handleLogin(BuildContext context) async {
    // Validar el formulario antes de continuar
    if (!_formKey.currentState!.validate()) return;

    final auth = context.read<AuthProvider>();

    await auth.login(
      _emailCtrl.text.trim(),
      _passwordCtrl.text,
    );

    // Si hay error tras el intento, mostrar SnackBar
    if (auth.error != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error!),
          backgroundColor: _kPrimary,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    // La navegación al home la maneja AuthProvider vía go_router redirect.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBackground,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: ConstrainedBox(
            // Ancho máximo 420px para layout web centrado
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
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // -------------------------------------------------------
                    // Logo universidad (con fallback a texto si no existe)
                    // -------------------------------------------------------
                    _UniversityLogo(),
                    const SizedBox(height: 24),

                    // -------------------------------------------------------
                    // Branding DentoMAX
                    // -------------------------------------------------------
                    Text(
                      'DentoMAX',
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: _kPrimary,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Anatomía Radiográfica Maxilofacial',
                      style: TextStyle(
                        fontSize: 12,
                        color: _kTextMuted,
                        letterSpacing: 0.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 36),

                    // -------------------------------------------------------
                    // Formulario de inicio de sesión
                    // -------------------------------------------------------
                    Consumer<AuthProvider>(
                      builder: (context, auth, _) {
                        return Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Campo email
                              _DarkTextFormField(
                                controller: _emailCtrl,
                                label: 'Correo electrónico',
                                hint: 'ejemplo@utalca.cl',
                                keyboardType: TextInputType.emailAddress,
                                enabled: !auth.isLoading,
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Ingresa tu correo';
                                  }
                                  final emailRegex = RegExp(
                                      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                                  if (!emailRegex.hasMatch(v.trim())) {
                                    return 'Correo inválido';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Campo contraseña con toggle de visibilidad
                              _DarkTextFormField(
                                controller: _passwordCtrl,
                                label: 'Contraseña',
                                hint: '••••••••',
                                obscureText: _obscurePassword,
                                enabled: !auth.isLoading,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: _kTextMuted,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(
                                      () => _obscurePassword = !_obscurePassword),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Ingresa tu contraseña';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 8),

                              // Link "Olvidé mi contraseña"
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: auth.isLoading
                                      ? null
                                      : () => context.go('/recuperar'),
                                  child: const Text(
                                    'Olvidé mi contraseña',
                                    style: TextStyle(
                                      color: _kTextMuted,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Botón "Iniciar Sesión" o indicador de carga
                              auth.isLoading
                                  ? const Center(
                                      child: CircularProgressIndicator(
                                        color: _kPrimary,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : ElevatedButton(
                                      onPressed: () => _handleLogin(context),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.white,
                                        foregroundColor: Colors.black,
                                        minimumSize:
                                            const Size(double.infinity, 48),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        elevation: 0,
                                      ),
                                      child: const Text(
                                        'Iniciar Sesión',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),
                                    ),
                              const SizedBox(height: 24),

                              // Link "¿No tienes cuenta? Regístrate"
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text(
                                    '¿No tienes cuenta? ',
                                    style: TextStyle(
                                        color: _kTextMuted, fontSize: 13),
                                  ),
                                  GestureDetector(
                                    onTap: auth.isLoading
                                        ? null
                                        : () => context.go('/registro'),
                                    child: const Text(
                                      'Regístrate',
                                      style: TextStyle(
                                        color: _kPrimary,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Widget: logo de la universidad con fallback a texto
// ---------------------------------------------------------------------------
class _UniversityLogo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 56,
      child: Image.asset(
        'assets/images/logo.png',
        height: 56,
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) {
          // Fallback: texto cuando el asset no existe (desarrollo)
          return Text(
            'Universidad de Talca',
            style: TextStyle(
              color: _kTextMuted,
              fontSize: 13,
              letterSpacing: 0.5,
            ),
          );
        },
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Widget reutilizable: TextFormField estilo oscuro del diseño DentoMAX
// ---------------------------------------------------------------------------
class _DarkTextFormField extends StatelessWidget {
  const _DarkTextFormField({
    required this.controller,
    required this.label,
    this.hint,
    this.keyboardType,
    this.obscureText = false,
    this.enabled = true,
    this.suffixIcon,
    this.validator,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool enabled;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      enabled: enabled,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: _kTextMuted, fontSize: 13),
        hintStyle: const TextStyle(color: _kInputBorder, fontSize: 13),
        filled: true,
        fillColor: _kInputBg,
        suffixIcon: suffixIcon,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
          borderSide: const BorderSide(color: _kPrimary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kPrimary),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kPrimary, width: 1.5),
        ),
        errorStyle: const TextStyle(color: _kPrimary, fontSize: 12),
      ),
    );
  }
}
