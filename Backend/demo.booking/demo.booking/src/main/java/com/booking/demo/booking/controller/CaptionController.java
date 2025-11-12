package com.booking.demo.booking.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@RestController
@RequestMapping("/api/safari")
@CrossOrigin(origins = "http://localhost:5173")
public class CaptionController {

    private static final String API_KEY = "AIzaSyC2LYgw7fY7l-APHk29NRL6TXbqqBadw1Y";
    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

    @PostMapping("/image-caption")
    public ResponseEntity<?> generateImageCaption(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "points", required = false) String pointsJson
    ) {
        try {
            List<String> points = new ArrayList<>();
            if (pointsJson != null && !pointsJson.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                points = Arrays.asList(mapper.readValue(pointsJson, String[].class));
            }

            if ((file == null || file.isEmpty()) && points.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Please provide image or points or both."));
            }

            // 🔹 Refined prompt
            StringBuilder prompt = new StringBuilder();
            prompt.append("Generate one aesthetic, adventurous, promotional social-media caption ")
                    .append("that highlights the premium safari experience of Kumana Wild Trails. ")
                    .append("The tone must feel exciting, adventurous, and high-quality. ")
                    .append("Use emojis naturally to enhance the mood. ")
                    .append("Do not include any hashtags in the main caption. ");

            if (!points.isEmpty()) {
                prompt.append("Incorporate these safari highlights: ");
                points.forEach(p -> prompt.append(p).append(". "));
            }
            if (file != null && !file.isEmpty()) {
                prompt.append("Analyze the image content and enrich the story-like caption. ");
            }

            // 🔹 Build request JSON
            List<String> parts = new ArrayList<>();
            parts.add("{\"text\": \"" + prompt.toString().replace("\"", "\\\"") + "\"}");

            if (file != null && !file.isEmpty()) {
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                parts.add("{\"inline_data\": {\"mime_type\": \"" + file.getContentType()
                        + "\", \"data\": \"" + base64 + "\"}}");
            }

            String jsonRequest = """
            {
              "contents": [
                {
                  "parts": [%s]
                }
              ]
            }
            """.formatted(String.join(",", parts));

            // 🔹 Send request to Gemini
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.size() == 0) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "No candidates found in Gemini response"));
            }

            String caption = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            if (caption == null || caption.isBlank()) {
                return ResponseEntity.status(500).body(Map.of("error", "Caption missing in Gemini response"));
            }

            // 🔹 Clean caption
            caption = caption.replaceAll("(?i)^here(’|')?s a caption[^:]*:\\s*", "")
                    .replaceAll("\\*\\*Image Content Analysis:\\*\\*.*", "")
                    .replaceAll("\\s{2,}", " ")
                    .trim();

            // 🔹 Contact info + fixed hashtags
            String contactInfo = """

            \n\nKumana Wild Trails — Safari with Rushan
            WhatsApp: 📱 +94 777 946 022
            Email: 📧 kumanawildtrails@gmail.com
            \n
            """;

            String hashtags = "#KumanaWildTrails #KumanaNationalPark #KumanaSafari "
                    + "#BestSafariSriLanka #RushanSafari #SafariSriLanka #SafariExperience "
                    + "#ArugamBayThingsToDo #KumanaNationalParkSafari "
                    + "#WildlifePhotographySriLanka #KumanaSafariPrice";

            // 🔹 Ensure hashtags are at the very end
            caption = caption + contactInfo + hashtags;

            return ResponseEntity.ok(Map.of("caption", caption));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
