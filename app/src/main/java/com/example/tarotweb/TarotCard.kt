package com.example.tarotweb

data class TarotCard(
    val id: Int,
    val name: String,
    val description: String,
    val arcanaType: String, // Major or Minor
    val imageRes: String // Por ahora usaremos nombres, luego pondremos recursos
)

object TarotDeck {
    val cards = listOf(
        TarotCard(0, "El Loco", "Nuevos comienzos, espontaneidad, fe.", "Major", "el_loco"),
        TarotCard(1, "El Mago", "Acción, consciencia, poder personal.", "Major", "el_mago"),
        TarotCard(2, "La Sacerdotisa", "Intuición, misterio, subconsciente.", "Major", "la_sacerdotisa"),
        TarotCard(3, "La Emperatriz", "Fecundidad, naturaleza, abundancia.", "Major", "la_emperatriz"),
        TarotCard(10, "La Rueda de la Fortuna", "Cambio, destino, ciclos.", "Major", "rueda_fortuna"),
        TarotCard(13, "La Muerte", "Final de un ciclo, transformación profunda.", "Major", "la_muerte"),
        TarotCard(18, "La Luna", "Ilusiones, miedo, ansiedad, intuición.", "Major", "la_luna"),
        TarotCard(19, "El Sol", "Éxito, brillo, alegría, verdad.", "Major", "el_sol")
    )

    fun getRandomCard(): TarotCard = cards.random()
}