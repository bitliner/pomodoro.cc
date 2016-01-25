defmodule Api.Router.Tasks do
  use Plug.Router

  alias Api.Repo
  alias Api.Models.Todo

  plug :match
  plug :dispatch

  get "/" do
    user_id = Utils.extract_user_id_from(conn.assigns[:user])
    conn = fetch_query_params(conn)
    query = conn.query_params
    tasks = case query do
      %{"completed" => _, "day" => day } -> Repo.daily_completed_tasks_for(user_id, day)
      _ -> Repo.tasks_for(user_id)
    end
    send_resp(conn, 200, Poison.encode!(tasks))
  end

  get "/:task_id" do
    user_id = Utils.extract_user_id_from(conn.assigns[:user])
    task = Repo.task_for(user_id, task_id)
    send_resp(conn, 200, Poison.encode!(task))
  end

  post "/" do
    user_id = Utils.extract_user_id_from(conn.assigns[:user])
    changeset = Todo.changeset(%Todo{}, conn.params)
    {:ok, todos} = Repo.create_task_for(user_id, changeset)
    send_resp(conn, 201, Poison.encode!(todos))
  end

  put "/:task_id" do
    user_id = Utils.extract_user_id_from(conn.assigns[:user])
    old_task = Repo.task_for(user_id, task_id)
    updated_task = Todo.changeset(old_task, conn.params)
    {:ok, todos} = Repo.update_task_for(user_id, updated_task)
    send_resp(conn, 201, Poison.encode!(todos))
  end

end
