import express from "express";
import supabase from "./supabase.js";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/news/:id", async (req, res) => {
  console.log("GET /api/news/:id");

  console.log("req.params", req.params);

  const id = req.params.id;

  const query = supabase.from("news").select("*").eq("id", id);

  const { data, error } = await query;

  console.log("data", error);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const newData = {
    data: data[0],
  };

  return res.status(200).json(newData);
});

app.post("/api/news", async (req, res) => {
  try {
    // return res.status(400).json({ error: "err" });

    const params = req.query;
    const body = req.body;
    const limit = body?.limit || 20;
    const page = body?.page || 1;
    const offset = (page - 1) * limit;
    const date_from = body?.from;
    const date_to = body?.to;
    const search = body?.q;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // get data from database
    const query = supabase.from("news").select("*");

    if (date_from && date_to) {
      query.gte("publicationdate", date_from).lte("publicationdate", date_to);
    }

    if (search) {
      query.ilike("title", `%${search}%`);
    }

    query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const total = (
      await supabase.from("news").select("id", { count: "exact", head: true })
    ).count;

    const responseData = {
      data: data,
      pagination: {
        page,
        perPage: limit,
        total: total,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/events", async (req, res) => {
  try {
    // return res.status(400).json({ error: "err" });

    // const params = req.query;
    const body = req.body;
    const limit = body?.limit || 20;
    const page = body?.page || 1;
    const offset = (page - 1) * limit;
    const date_from = body?.from;
    const date_to = body?.to;
    const search = body?.q;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // get data from database
    const query = supabase.from("news").select("*");

    if (date_from && date_to) {
      query.gte("date", date_from).lte("events", date_to);
    }

    if (search) {
      query.ilike("title", `%${search}%`);
    }

    query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const total = (
      await supabase.from("news").select("id", { count: "exact", head: true })
    ).count;

    const responseData = {
      data: data,
      pagination: {
        page,
        perPage: limit,
        total: total,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/events/:id", async (req, res) => {
  const id = req.params.id;

  const query = supabase.from("events").select("*").eq("id", id);

  const { data, error } = await query;

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const newData = {
    data: data[0],
  };

  return res.status(200).json(newData);
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
